"use client";

import {
    Codepen,
    FilePen,
    FolderKanban,
    Folders,
    MessageCircleMore,
    Settings,
    Tag,
    X,
} from "lucide-react";
import { motion, Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import { useSidebar } from "@/hooks/dashboard/use-sidebar";
import useMedia from "@/hooks/use-media";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/theme-toggle";
import { ReactNode, useEffect, useState } from "react";

const sidebarVariants: Variants = {
    open: {
        x: 0,
        transition: {
            type: "spring", // 弹簧动画
            stiffness: 300, // 弹簧硬度
            damping: 29, // 弹簧阻尼
        },
    },
    closed: {
        x: "-100%",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

// 导航项背景动画
const navItemBackgroundVariants: Variants = {
    // 初始/空闲状态：背景从右侧缩放为0（看不见）
    idle: {
        scaleX: 0,
        transformOrigin: "left",
        transition: { type: "tween", duration: 0.2 },
    },
    // 悬浮状态：背景从左侧展开
    hover: {
        scaleX: 1,
        transformOrigin: "left",
        transition: { type: "tween", duration: 0.2 },
    },
    // 激活状态：背景从左侧展开
    active: {
        scaleX: 1,
        transformOrigin: "left",
        transition: { type: "tween", duration: 0.2 },
    },
};

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
        {
            href: "/dashboard/comments",
            label: "评论",
            icon: <MessageCircleMore size={24} />,
            active: pathname.startsWith("/dashboard/comments"),
        },
    ];
};

interface NavItemProps {
    href: string;
    label: string;
    icon: ReactNode;
    active: boolean;
}

function NavItem({ href, label, icon, active }: NavItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={href}
            className="relative flex items-center gap-4 px-4 py-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 动画背景 */}
            <motion.div
                className={cn(
                    "absolute inset-0 bg-primary/70 rounded-sm",
                    active && "bg-primary"
                )}
                variants={navItemBackgroundVariants}
                animate={active ? "active" : isHovered ? "hover" : "idle"}
            />
            {/* 图标和文字 */}
            <div className={cn("z-10 transition-colors duration-200")}>
                {icon}
            </div>
            <span className={cn("z-10 transition-colors duration-200")}>
                {label}
            </span>
        </Link>
    );
}

export default function DashboardSideBar() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    });

    const { isSidebarOpen, setSidebarOpen } = useSidebar();
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    const isDesktop = useMedia("(min-width: 768px)") && isClient;

    const pathname = usePathname();

    const sidebarNavItems = getSidebarNavItems(pathname);

    return (
        <motion.aside
            initial={false}
            variants={sidebarVariants}
            animate={isSidebarOpen || isDesktop ? "open" : "closed"}
            className={cn(
                "bg-background w-[280px] md:w-[320px] h-full z-11 fixed top-0 left-0 p-4",
                "md:relative md:z-auto",
                "rounded-tr-3xl rounded-br-3xl md:rounded-none"
            )}
        >
            {/* 侧边栏顶部 */}
            <div className="p-4 flex justify-between md:justify-center items-center">
                <p className="text-xl font-bold text-center">侧边栏</p>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden"
                    aria-label="关闭菜单"
                >
                    <X size={24} />
                </button>
            </div>
            {/* 侧边栏中间 */}
            <div className="w-full flex flex-col mt-12 md:mt-24 gap-4 px-8">
                <p className="font-bold text-left w-full">内容管理</p>
                {sidebarNavItems.map((item) => (
                    <NavItem key={`${item.label}-${item.href}`} {...item} />
                ))}
            </div>
            {/* 侧边栏底部 */}
            <div className="w-full flex flex-col mt-8 md:mt-16 gap-4 px-8">
                <p className="font-bold text-left w-full mt-12">其他管理</p>
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-4 px-4 py-2"
                >
                    <Settings size={24} />
                    <span>设置</span>
                </Link>
                <ThemeToggle
                    size={6}
                    text={isDark ? "夜间模式" : "日间模式"}
                    className="px-4 py-2 gap-4 justify-start cursor-pointer"
                />
            </div>
        </motion.aside>
    );
}
