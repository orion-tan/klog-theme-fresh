// 登录界面

"use client";

import { useEffect, useState } from "react";
import { KLogError, NetworkError } from "klog-sdk";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

import { getKLogSDK } from "@/lib/api-request";
import { Button } from "@/components/mui/button";
import { FloatingLabelInput } from "@/components/mui/floating-label-input";
import { Toaster } from "@/components/mui/sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/mui/card";

const loginSchema = yup.object({
    login: yup
        .string()
        .min(1, "用户名或邮箱不能为空")
        .max(30, "用户名或邮箱长度超出限制")
        .required(),
    password: yup
        .string()
        .min(8, "密码不低于8位")
        .max(30, "密码长度超出限制")
        .required(),
});

export default function LoginPageComponent({
    redirect,
}: {
    redirect?: string;
}) {
    const [error, setError] = useState<string | undefined>(undefined);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<yup.InferType<typeof loginSchema>> = async (
        data
    ) => {
        try {
            setError(undefined);
            await getKLogSDK().auth.login(data);
            if (redirect) {
                router.replace(redirect);
            } else {
                router.replace("/");
            }
        } catch (error) {
            if (error instanceof NetworkError) {
                console.warn(error.message);
                setError(`登录失败：${error.message}`);
            } else if (error instanceof KLogError) {
                console.warn(error.message);
                setError(`登录失败：${error.message}`);
            }
            console.error(error);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>登录</CardTitle>
                        <CardDescription>
                            要获取更多功能，请先登录
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <FloatingLabelInput
                            label="用户名或邮箱"
                            {...register("login")}
                            error={errors.login?.message}
                            className="bg-surface"
                        />
                        <FloatingLabelInput
                            label="密码"
                            type="password"
                            {...register("password")}
                            error={errors.password?.message}
                            className="bg-surface"
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">登录</Button>
                    </CardFooter>
                </Card>
            </form>
            <Toaster />
        </>
    );
}
