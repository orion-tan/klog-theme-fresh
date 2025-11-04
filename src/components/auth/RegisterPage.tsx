// 注册界面组件

"use client";

import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { KLogError, NetworkError } from "klog-sdk";
import { useRouter } from "next/navigation";

import { getKLogSDK } from "@/lib/api-request";

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
                                <>
                                    <label
                                        htmlFor={field.name}
                                        className="text-end"
                                    >
                                        {"用户名: "}
                                    </label>
                                    <div className="flex items-center justify-between pt-1 gap-2">
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            placeholder={"输入用户名"}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className="p-2 rounded-sm flex-1 bg-background"
                                        />
                                        <FieldInfo field={field} />
                                    </div>
                                </>
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
                                <>
                                    <label
                                        htmlFor={field.name}
                                        className="text-end"
                                    >
                                        {"邮箱: "}
                                    </label>
                                    <div className="flex items-center justify-between pt-1 gap-2">
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            placeholder={"输入邮箱"}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className="p-2 rounded-sm flex-1 bg-background"
                                        />
                                        <FieldInfo field={field} />
                                    </div>
                                </>
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
                                <>
                                    <label
                                        htmlFor={field.name}
                                        className="text-end"
                                    >
                                        {"密码: "}
                                    </label>
                                    <div className="flex items-center justify-between pt-1 gap-2">
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type="password"
                                            placeholder={"输入密码"}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className="p-2 rounded-sm flex-1 bg-background"
                                        />
                                        <FieldInfo field={field} />
                                    </div>
                                </>
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
                                <>
                                    <label
                                        htmlFor={field.name}
                                        className="text-end"
                                    >
                                        {"昵称: "}
                                    </label>
                                    <div className="flex items-center justify-between pt-1 gap-2">
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            placeholder={"输入昵称"}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className="p-2 rounded-sm flex-1 bg-background"
                                        />
                                        <FieldInfo field={field} />
                                    </div>
                                </>
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
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full mt-2 bg-primary text-foreground rounded-sm px-4 py-2 disabled:bg-primary/60"
                                >
                                    {isSubmitting
                                        ? "..."
                                        : !canSubmit
                                        ? "不能注册"
                                        : "注册"}
                                </button>
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
