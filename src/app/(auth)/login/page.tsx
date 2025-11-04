// 登录界面

import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import LoginPageComponent from "@/components/auth/LoginPage";

export const metadata: Metadata = {
    title: `${siteConfig.title} | 登录`,
    description: "登录到你的账户",
};

export default function LoginPage() {
    return <LoginPageComponent />;
}
