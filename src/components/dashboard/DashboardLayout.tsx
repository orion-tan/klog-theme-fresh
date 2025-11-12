// 管理后台主内容布局

import { SidebarTrigger } from "@/components/mui/sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
    title: string;
    children?: React.ReactNode;
    className?: string;
}

export default function DashboardLayout({
    title,
    children,
    className,
}: DashboardLayoutProps) {
    return (
        <div className={cn("bg-background text-foreground", className)}>
            <header className="sticky top-0 z-10 bg-background border-b-2 border-border">
                <div className="flex items-center gap-4 px-6 py-4">
                    <SidebarTrigger />
                    <h2 className="text-xl font-bold text-foreground">
                        {title}
                    </h2>
                </div>
            </header>
            <div className="p-4">{children}</div>
        </div>
    );
}
