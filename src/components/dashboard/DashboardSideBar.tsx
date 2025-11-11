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
import { useTheme } from "next-themes";

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
            href: "/dashboard",
            label: "总览",
            icon: <Codepen size={24} />,
            active: pathname === "/dashboard",
        },
        {
            href: "/dashboard/posts",
            label: "文章",
            icon: <FilePen size={24} />,
            active: pathname.startsWith("/dashboard/posts"),
        },
        {
            href: "/dashboard/projects",
            label: "项目",
            icon: <FolderKanban size={24} />,
            active: pathname.startsWith("/dashboard/projects"),
        },
        {
            href: "/dashboard/categories",
            label: "分类",
            icon: <Folders size={24} />,
            active: pathname.startsWith("/dashboard/categories"),
        },
        {
            href: "/dashboard/tags",
            label: "标签",
            icon: <Tag size={24} />,
            active: pathname.startsWith("/dashboard/tags"),
        },
    ];
};

interface NavItemProps {
    href: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
}

function NavItem({ href, label, icon, active }: NavItemProps) {
    return (
        <SidebarMenuButton tooltip={label} asChild>
            <Link href={href}>
                {icon}
                {label}
            </Link>
        </SidebarMenuButton>
    );
}

export default function DashboardSideBar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { isDarkMode, toggleTheme } = useThemeToggle();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="后台管理">
                            <Folders />
                            <span>后台管理</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>内容管理</SidebarGroupLabel>
                    <SidebarMenu>
                        {getSidebarNavItems(pathname).map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <NavItem {...item} />
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>系统管理</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <NavItem
                                href="/dashboard/settings"
                                label="设置"
                                icon={<Settings />}
                                active={pathname === "/dashboard/settings"}
                            />
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
