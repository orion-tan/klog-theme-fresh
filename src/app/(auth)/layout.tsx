"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import useMedia from "@/hooks/use-media";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AuthLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isMobile = useMedia("(max-width: 767px)");
    const isRegister = pathname === "/register";

    const redirect = searchParams.get("redirect");
    const loginHref = redirect ? `/login?redirect=${redirect}` : "/login";
    const registerHref = redirect
        ? `/register?redirect=${redirect}`
        : "/register";

    return (
        <main className="flex items-center justify-center min-h-screen w-full p-4 bg-surface">
            <div
                className={cn(
                    "relative border-2 border-border overflow-hidden",
                    "w-full max-w-sm h-[800px]",
                    "md:w-[800px] md:h-[650px] md:max-w-none"
                )}
            >
                {/* 表单区域 */}
                <motion.div
                    className={cn(
                        "absolute top-0 left-0 overflow-y-auto py-4",
                        "w-full h-4/5",
                        "md:w-3/5 md:h-full"
                    )}
                    initial={false}
                    animate={
                        isMobile
                            ? { y: isRegister ? "25%" : "0%", x: "0%" }
                            : { x: isRegister ? "60%" : "0%", y: "0%" }
                    }
                    transition={{
                        type: "tween",
                        duration: 0.7,
                        ease: "easeInOut",
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
                {/* 覆盖层区域 */}
                <motion.div
                    className={cn(
                        "absolute top-0 left-0 bg-background z-10",
                        "w-full h-1/5 ring-2 ring-border",
                        "md:w-2/5 md:h-full"
                    )}
                    initial={false}
                    animate={
                        isMobile
                            ? {
                                  y: isRegister ? "0%" : "400%",
                                  x: "0%",
                              }
                            : {
                                  x: isRegister ? "0%" : "150%",
                                  y: "0%",
                              }
                    }
                    transition={{
                        type: "tween",
                        duration: 0.7,
                        ease: "easeInOut",
                    }}
                >
                    <div className="relative h-full w-full">
                        {/* 登录页覆盖层 */}
                        <motion.div
                            className="absolute w-full h-full flex flex-col items-center justify-center text-center px-10"
                            initial={false}
                            animate={{
                                opacity: isRegister ? 0 : 1,
                                pointerEvents: isRegister ? "none" : "auto",
                            }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="text-3xl font-bold mb-4">
                                您好，朋友！
                            </h1>
                            <p className="mb-8 hidden md:block">
                                输入您的信息，然后让我们开始
                            </p>
                            <Button asChild className="w-full">
                                <Link href={registerHref} replace>
                                    注册
                                </Link>
                            </Button>
                        </motion.div>
                        {/* 注册页覆盖层 */}
                        <motion.div
                            className="absolute w-full h-full flex flex-col items-center justify-center text-center px-10"
                            initial={false}
                            animate={{
                                opacity: isRegister ? 1 : 0,
                                pointerEvents: isRegister ? "auto" : "none",
                            }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="text-3xl font-bold mb-4">
                                欢迎回来！
                            </h1>
                            <p className="mb-8 hidden md:block">
                                要获取更多信息，请先登录
                            </p>
                            <Button asChild className="w-full">
                                <Link href={loginHref} replace>
                                    登录
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
