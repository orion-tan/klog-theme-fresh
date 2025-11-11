// 管理后台共享布局
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SidebarProvider, SidebarInset } from "@/components/mui/sidebar";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";

const queryClient = new QueryClient();

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <DashboardSideBar />
            <SidebarInset>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
