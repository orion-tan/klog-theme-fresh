// 登录界面

"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { KLogError, NetworkError } from "klog-sdk";
import { useSearchParams, useRouter } from "next/navigation";

import { getKLogSDK } from "@/lib/api-request";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

const loginSchema = z.object({
    login: z
        .string()
        .min(1, "用户名或邮箱不能为空")
        .max(30, "用户名或邮箱长度超出限制"),
    password: z.string().min(8, "密码不低于8位").max(30, "密码长度超出限制"),
});

export default function LoginPageComponent() {
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
                <form.Field
                    name="login"
                    children={(field) => {
                        return (
                            <FloatingLabelInput
                                error={field.state.meta.errors
                                    .map((e) => e?.message)
                                    .join(", ")}
                                htmlFor={field.name}
                                label="用户名或邮箱"
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

                {/* 密码 */}
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

                {/* 提交按钮 */}
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => {
                        return (
                            <div>
                                <Button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full mt-5"
                                    variant="outline"
                                    size="lg"
                                >
                                    {isSubmitting
                                        ? "..."
                                        : !canSubmit
                                        ? "不能登录"
                                        : "登录"}
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
