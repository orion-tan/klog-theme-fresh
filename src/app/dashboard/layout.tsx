// 管理后台共享布局
"use client";

import { SidebarProvider, useSidebar } from "@/hooks/dashboard/use-sidebar";
import { AnimatePresence, motion } from "motion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DashboardSideBar from "@/components/dashboard/DashboardSideBar";

const queryClient = new QueryClient();

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SidebarProvider>
                <LayoutContent>{children}</LayoutContent>
            </SidebarProvider>
        </QueryClientProvider>
    );
}

function LayoutContent({ children }: DashboardLayoutProps) {
    const { isSidebarOpen, setSidebarOpen } = useSidebar();

    return (
        <div className="min-h-screen w-full bg-background flex overflow-y-hidden">
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
            <main className="bg-background-1 md:border-l-3 md:border-border flex-1 max-h-screen">
                <AnimatePresence mode="wait">{children}</AnimatePresence>
            </main>
        </div>
    );
}
