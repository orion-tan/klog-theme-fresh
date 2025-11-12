"use client";

import {
    Codepen,
    FilePen,
    FolderKanban,
    Folders,
    Moon,
    Settings,
    Sun,
    Tag,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuButton,
} from "@/components/mui/sidebar";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

const getSidebarNavItems = (pathname: string) => {
    return [
        {
            href: "/qwq",
            label: "总览",
            icon: Codepen,
            active: pathname === "/qwq",
        },
        {
            href: "/qwq/posts",
            label: "文章",
            icon: FilePen,
            active: pathname.startsWith("/qwq/posts"),
        },
        {
            href: "/qwq/projects",
            label: "项目",
            icon: FolderKanban,
            active: pathname.startsWith("/qwq/projects"),
        },
        {
            href: "/qwq/categories",
            label: "分类",
            icon: Folders,
            active: pathname.startsWith("/qwq/categories"),
        },
        {
            href: "/qwq/tags",
            label: "标签",
            icon: Tag,
            active: pathname.startsWith("/qwq/tags"),
        },
    ];
};

export default function DashboardSideBar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { isDarkMode, toggleTheme } = useThemeToggle();

    const sidebarNavItems = getSidebarNavItems(pathname);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size={"lg"}
                            tooltip="后台管理"
                            variant={"outline"}
                        >
                            <div className="flex items-center justify-center size-8 aspect-square">
                                <Folders />
                            </div>
                            <span>后台管理</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>内容管理</SidebarGroupLabel>
                    <SidebarMenu>
                        {sidebarNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    tooltip={item.label}
                                    isActive={item.active}
                                    asChild
                                >
                                    <Link
                                        href={item.href}
                                        aria-label={item.label}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>系统管理</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="设置" asChild>
                                <Link href="/dashboard/settings">
                                    <Settings />
                                    <span>设置</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="切换主题"
                                onClick={toggleTheme}
                            >
                                {isDarkMode ? <Moon /> : <Sun />}
                                <span className="ml-2">切换主题</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
