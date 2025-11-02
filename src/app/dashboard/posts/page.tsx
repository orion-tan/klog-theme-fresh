import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import PostViewTab from "@/components/dashboard/tabs/PostViewTab";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: `${siteConfig.title} | 文章`,
    description: "后台文章管理",
};

function PostViewSkeleton() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-center">Loading...</h1>
        </div>
    );
}

export default function PostsPage() {
    return (
        <div className="bg-background-1 text-foreground h-full py-8">
            <Suspense fallback={<PostViewSkeleton />}>
                <PostViewTab />
            </Suspense>
        </div>
    );
}
