"use client";

import { useSidebar } from "@/hooks/dashboard/use-sidebar";
import { Menu } from "lucide-react";

export default function DashboardPage() {
    const { setSidebarOpen } = useSidebar();

    return (
        <header className="md:hidden mb-4">
            <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
                aria-label="打开菜单"
            >
                <Menu size={24} />
            </button>
        </header>
    );
}
