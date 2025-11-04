// 注册界面

import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import RegisterPageComponent from "@/components/auth/RegisterPage";

export const metadata: Metadata = {
    title: `${siteConfig.title} | 注册`,
    description: "注册一个新的账户",
};

export default function RegisterPage() {
    return <RegisterPageComponent />;
}
