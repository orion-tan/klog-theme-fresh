"use client";

import { SidebarTrigger } from "@/components/mui/sidebar";

export default function DashboardPage() {
    return (
        <header className="flex h-16 shrink-0 items-center px-4 gap-2">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">后台管理</h1>
        </header>
    );
}
