"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import LoginPageComponent from "@/components/auth/LoginPage";
import RegisterPageComponent from "@/components/auth/RegisterPage";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/mui/tabs";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { Button } from "@/components/mui/button";

export default function AuthPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toggleTheme, isDarkMode } = useThemeToggle();

    const isRegister = pathname === "/register";

    const redirect = searchParams.get("redirect") || undefined;

    return (
        <main className="bg-background text-foreground flex items-center justify-center min-h-screen w-full p-4">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue={isRegister ? "register" : "login"}>
                    <TabsList>
                        <TabsTrigger value="login">{"登录"}</TabsTrigger>
                        <TabsTrigger value="register">{"注册"}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginPageComponent redirect={redirect} />
                    </TabsContent>
                    <TabsContent value="register">
                        <RegisterPageComponent redirect={redirect} />
                    </TabsContent>
                </Tabs>
                <div className="flex justify-center items-center">
                    <Button onClick={toggleTheme} variant="ghost">
                        {isDarkMode ? <Moon /> : <Sun />}
                        我要换个样式
                    </Button>
                </div>
            </div>
        </main>
    );
}
