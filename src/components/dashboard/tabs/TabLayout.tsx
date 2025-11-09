// 后台管理界面基础布局

import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TabLayoutProps {
    children: React.ReactNode;
    title: string;
    onSidebarMenuClick: () => void;
    backLink?: string;
    backBtnText?: string;
    className?: string;
}

export default function TabLayout({
    children,
    title,
    onSidebarMenuClick,
    backLink,
    backBtnText,
    className,
}: TabLayoutProps) {
    return (
        <div
            className={cn(
                "bg-background text-foreground flex flex-col gap-4 h-full max-h-screen pb-8 overflow-y-auto scrollbar-thin",
                className
            )}
        >
            {/* 顶部大标题 */}
            <header className="bg-background flex items-center justify-between gap-4 px-4 md:px-8 py-4 h-16 border-b-2 border-border sticky top-0 z-8">
                <div className="inline-flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                        aria-label="打开菜单"
                        onClick={onSidebarMenuClick}
                    >
                        <Menu size={16} />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold text-primary">
                        {title}
                    </h1>
                </div>
                {backLink && backBtnText && (
                    <Link href="/dashboard/posts">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {backBtnText}
                        </Button>
                    </Link>
                )}
            </header>
            {/* 内容区域 */}
            <div className="container mx-auto px-2 md:px-4 space-y-4 flex-1">
                {children}
            </div>
        </div>
    );
}
