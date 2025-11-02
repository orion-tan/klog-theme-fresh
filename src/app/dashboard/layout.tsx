// 管理后台共享布局
"use client";

import { SidebarProvider, useSidebar } from "@/hooks/dashboard/use-sidebar";
import { AnimatePresence, motion } from "motion/react";

import DashboardSideBar from "@/components/dashboard/DashboardSideBar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
    );
}

function LayoutContent({ children }: DashboardLayoutProps) {
    const { isSidebarOpen, setSidebarOpen } = useSidebar();

    return (
        <div className="min-h-screen w-full bg-background flex overflow-x-hidden">
            {/* 侧边栏 */}
            <DashboardSideBar />
            {/* 移动端展开时的遮罩层 */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-background/50 z-10 opacity-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />
                )}
            </AnimatePresence>
            {/* 主内容区域 */}
            <main className="bg-background-1 md:rounded-tl-3xl md:rounded-bl-3xl flex-1 p-4">
                <AnimatePresence mode="wait">{children}</AnimatePresence>
            </main>
        </div>
    );
}
