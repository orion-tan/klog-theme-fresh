// 设置页面

"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Loader2, Menu } from "lucide-react";
import type { UserUpdateRequest } from "klog-sdk";
import { getKLogSDK } from "@/lib/api-request";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { AvatarUpload } from "@/components/dashboard/settings/AvatarUpload";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";

export default function SettingsPage() {
    const klogSdk = getKLogSDK();
    const queryClient = useQueryClient();
    const { setSidebarOpen } = useSidebar();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 获取当前用户信息
    const { data: user, isLoading } = useQuery({
        queryKey: ["user:me"],
        queryFn: () => klogSdk.auth.getMe(),
    });

    // 表单管理
    const form = useForm({
        defaultValues: {
            username: "",
            nickname: "",
            email: "",
            bio: "",
            avatar_url: "",
            old_password: "",
            new_password: "",
        },
        onSubmit: async ({ value }) => {
            if (!user) return;

            setIsSubmitting(true);
            setSuccessMessage(null);
            setErrorMessage(null);

            try {
                // 准备更新数据
                const updateData: UserUpdateRequest = {
                    username: value.username,
                    nickname: value.nickname,
                    email: value.email,
                    bio: value.bio || undefined,
                    avatar_url: value.avatar_url || undefined,
                };

                // 如果填写了密码，添加密码字段
                if (value.old_password && value.new_password) {
                    if (value.new_password.length < 8) {
                        setErrorMessage("新密码长度不能少于 8 位");
                        return;
                    }
                    updateData.old_password = value.old_password;
                    updateData.new_password = value.new_password;
                }

                await klogSdk.users.updateUser(user.id, updateData);
                queryClient.invalidateQueries({ queryKey: ["user:me"] });

                setSuccessMessage("保存成功！");

                // 清空密码字段
                form.setFieldValue("old_password", "");
                form.setFieldValue("new_password", "");

                // 3秒后清除成功提示
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (error) {
                setErrorMessage(
                    "保存失败：" + ((error as Error).message || "未知错误")
                );
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    // 用户数据加载后填充表单
    useEffect(() => {
        if (user) {
            form.setFieldValue("username", user.username);
            form.setFieldValue("nickname", user.nickname);
            form.setFieldValue("email", user.email);
            form.setFieldValue("bio", user.bio || "");
            form.setFieldValue("avatar_url", user.avatar_url || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // 头像上传
    const handleAvatarUpload = async (file: File) => {
        const response = await klogSdk.media.uploadFile(file);
        form.setFieldValue("avatar_url", response.url);
        return response.url;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full pb-8">
            {/* 顶部大标题 */}
            <header className="flex items-center justify-between px-4 md:px-8 h-16 border-b-2 border-border sticky top-0 z-10 bg-background">
                <div className="inline-flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                        aria-label="打开菜单"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={16} />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold text-primary">
                        ⚙️ 个人设置
                    </h1>
                </div>
            </header>

            {/* 表单区域 */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8">
                <div className="max-w-2xl mx-auto">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        {/* 成功/错误提示 */}
                        {successMessage && (
                            <div className="mb-4 p-3 border-2 border-green-500 bg-green-500/10 text-green-500">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="mb-4 p-3 border-2 border-red-500 bg-red-500/10 text-red-500">
                                {errorMessage}
                            </div>
                        )}

                        {/* 头像上传 */}
                        <section className="mb-8 p-6 border-2 border-border bg-background-1">
                            <h2 className="text-xl font-bold mb-4">📸 头像</h2>
                            <form.Field name="avatar_url">
                                {(field) => (
                                    <AvatarUpload
                                        currentAvatarUrl={field.state.value}
                                        onUpload={handleAvatarUpload}
                                    />
                                )}
                            </form.Field>
                        </section>

                        {/* 基本信息 */}
                        <section className="mb-8 p-6 border-2 border-border bg-background-1">
                            <h2 className="text-xl font-bold mb-4">基本信息</h2>
                            <div className="flex flex-col gap-4">
                                <form.Field name="username">
                                    {(field) => (
                                        <FloatingLabelInput
                                            label="用户名"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="nickname">
                                    {(field) => (
                                        <FloatingLabelInput
                                            label="昵称"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="email">
                                    {(field) => (
                                        <FloatingLabelInput
                                            label="邮箱"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            type="email"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="bio">
                                    {(field) => (
                                        <FloatingLabelInput
                                            label="简介（可选）"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </form.Field>
                            </div>
                        </section>

                        {/* 密码修改 */}
                        <section className="mb-8 p-6 border-2 border-border bg-background-1">
                            <h2 className="text-xl font-bold mb-4">
                                密码修改（可选）
                            </h2>
                            <div className="flex flex-col gap-4">
                                <form.Field name="old_password">
                                    {(field) => (
                                        <FloatingLabelInput
                                            label="旧密码"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            type="password"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="new_password">
                                    {(field) => (
                                        <FloatingLabelInput
                                            label="新密码（至少8位）"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            type="password"
                                            disabled={isSubmitting}
                                        />
                                    )}
                                </form.Field>
                            </div>
                        </section>

                        {/* 提交按钮 */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto"
                        >
                            {isSubmitting ? "保存中..." : "保存设置"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
