"use client";

import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import type { Metadata } from "next";
import { KLogError, NetworkError } from "klog-sdk";
import { useSearchParams, useRouter } from "next/navigation";

import { getKLogSDK } from "@/lib/api-request";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
    title: `${siteConfig.title} | 登录`,
    description: "登录到你的账户",
};

const loginSchema = z.object({
    login: z
        .string()
        .min(1, "用户名或邮箱不能为空")
        .max(30, "用户名或邮箱长度超出限制"),
    password: z.string().min(8, "密码不低于8位").max(30, "密码长度超出限制"),
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

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            login: "",
            password: "",
        },
        validators: {
            onChange: loginSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                setError(null);
                await getKLogSDK().auth.login(value);
                if (redirect) {
                    router.replace(redirect);
                } else {
                    router.replace("/");
                }
            } catch (e) {
                if (e instanceof NetworkError) {
                    console.warn(e.message);
                    setError(`登录失败：${e.message}`);
                } else if (e instanceof KLogError) {
                    console.warn(e.message);
                    setError(`登录失败：${e.message}`);
                }
            }
        },
    });

    return (
        <div className="flex flex-col items-center justify-center h-full px-4">
            <h1 className="font-bold text-2xl text-center mb-4">登录</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                {/* 用户名或邮箱 */}
                <div>
                    <form.Field
                        name="login"
                        children={(field) => {
                            return (
                                <>
                                    <label
                                        htmlFor={field.name}
                                        className="text-end"
                                    >
                                        {"用户名或邮箱: "}
                                    </label>
                                    <div className="flex items-center justify-between pt-1 gap-2">
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            placeholder={"输入用户名或邮箱"}
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
                                        ? "不能登录"
                                        : "登录"}
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
