// 注册界面组件

"use client";

import { useEffect, useState } from "react";
import { KLogError, NetworkError } from "klog-sdk";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

import { getKLogSDK } from "@/lib/api-request";
import { FloatingLabelInput } from "@/components/mui/floating-label-input";
import { Button } from "@/components/mui/button";
import { Toaster } from "@/components/mui/sonner";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@/components/mui/card";

const registerSchema = yup.object({
    username: yup
        .string()
        .min(1, "用户名不能为空")
        .max(30, "用户名长度超出限制")
        .required(),
    email: yup.string().email("邮箱格式不正确").required(),
    password: yup
        .string()
        .min(8, "密码不低于8位")
        .max(30, "密码长度超出限制")
        .required(),
    nickname: yup
        .string()
        .min(1, "昵称不能为空")
        .max(30, "昵称长度超出限制")
        .required(),
});

export default function RegisterPageComponent({
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
        resolver: yupResolver(registerSchema),
    });

    const onSubmit: SubmitHandler<
        yup.InferType<typeof registerSchema>
    > = async (data) => {
        try {
            setError(undefined);
            await getKLogSDK().auth.register(data);
            if (redirect) {
                router.replace(redirect);
            } else {
                router.replace("/");
            }
        } catch (error) {
            if (error instanceof NetworkError) {
                console.warn(error.message);
                setError(`注册失败：${error.message}`);
            } else if (error instanceof KLogError) {
                console.warn(error.message);
                setError(`注册失败：${error.message}`);
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
                        <CardTitle>注册</CardTitle>
                        <CardDescription>
                            输入您的信息，然后让我们开始
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <FloatingLabelInput
                            label="用户名"
                            {...register("username")}
                            error={errors.username?.message}
                            className="bg-surface"
                        />
                        <FloatingLabelInput
                            label="邮箱"
                            {...register("email")}
                            error={errors.email?.message}
                            className="bg-surface"
                        />
                        <FloatingLabelInput
                            label="昵称"
                            {...register("nickname")}
                            error={errors.nickname?.message}
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
                        <Button type="submit">注册</Button>
                    </CardFooter>
                </Card>
            </form>
            <Toaster />
        </>
    );
}
