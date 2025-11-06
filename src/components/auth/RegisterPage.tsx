// 注册界面组件

"use client";

import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { KLogError, NetworkError } from "klog-sdk";
import { useRouter } from "next/navigation";

import { getKLogSDK } from "@/lib/api-request";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
    username: z.string().min(1, "用户名不能为空").max(30, "用户名长度超出限制"),
    email: z.string().pipe(z.email("邮箱格式不正确")),
    password: z.string().min(8, "密码不低于8位").max(30, "密码长度超出限制"),
    nickname: z.string().min(1, "昵称不能为空").max(30, "昵称长度超出限制"),
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
    const errors = field.state.meta.errors
        .map((error) => error.message)
        .join(", ");
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <div className="text-sm text-red-500 text-clip" title={errors}>
                    {errors}
                </div>
            ) : null}
        </>
    );
}

export default function RegisterPageComponent() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            nickname: "",
        },
        validators: {
            onChange: registerSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                setError(null);
                await getKLogSDK().auth.register(value);
                // 延迟2s后跳转到登录界面
                setTimeout(() => {
                    router.replace("/login");
                }, 2000);
            } catch (e) {
                if (e instanceof NetworkError) {
                    console.warn(e.message);
                    setError(`注册失败：${e.message}`);
                } else if (e instanceof KLogError) {
                    console.warn(e.message);
                    setError(`注册失败：${e.message}`);
                }
            }
        },
    });

    return (
        <div className="flex flex-col items-center justify-center h-full px-4">
            <h1 className="font-bold text-2xl text-center mb-4">注册</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                {/* 用户名 */}
                <div>
                    <form.Field
                        name="username"
                        children={(field) => {
                            return (
                                <FloatingLabelInput
                                    error={field.state.meta.errors
                                        .map((e) => e?.message)
                                        .join(", ")}
                                    htmlFor={field.name}
                                    label="用户名"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                            );
                        }}
                    />
                </div>
                {/* 邮箱 */}
                <div>
                    <form.Field
                        name="email"
                        children={(field) => {
                            return (
                                <FloatingLabelInput
                                    error={field.state.meta.errors
                                        .map((e) => e?.message)
                                        .join(", ")}
                                    htmlFor={field.name}
                                    label="邮箱"
                                    type="email"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                            );
                        }}
                    />
                </div>
                {/* 密码 */}
                <div>
                    <form.Field
                        name="password"
                        children={(field) => {
                            return (
                                <FloatingLabelInput
                                    error={field.state.meta.errors
                                        .map((e) => e?.message)
                                        .join(", ")}
                                    htmlFor={field.name}
                                    label="密码"
                                    type="password"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                            );
                        }}
                    />
                </div>
                {/* 昵称 */}
                <div>
                    <form.Field
                        name="nickname"
                        children={(field) => {
                            return (
                                <FloatingLabelInput
                                    error={field.state.meta.errors
                                        .map((e) => e?.message)
                                        .join(", ")}
                                    htmlFor={field.name}
                                    label="昵称"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                            );
                        }}
                    />
                </div>
                {/* 提交按钮 */}

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => {
                        return (
                            <div>
                                <Button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full mt-2"
                                >
                                    {isSubmitting
                                        ? "..."
                                        : !canSubmit
                                        ? "不能注册"
                                        : "注册"}
                                </Button>
                                {error != null && (
                                    <div className="text-red-500 text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>
                        );
                    }}
                />
            </form>
        </div>
    );
}
