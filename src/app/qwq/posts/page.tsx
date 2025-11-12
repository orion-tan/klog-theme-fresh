import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import PostViewTab from "@/components/dashboard/tabs/PostViewTab";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
    title: `${siteConfig.title} | 文章管理`,
    description: "后台文章管理",
};

export default function PostsPage() {
    return (
        <DashboardLayout title="文章管理">
            <PostViewTab />
        </DashboardLayout>
    );
}
