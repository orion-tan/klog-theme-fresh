import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import PostNewTab from "@/components/dashboard/tabs/PostEditTab";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: `${siteConfig.title} | 新建文章`,
    description: "新建文章",
};

function PostViewSkeleton() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-center">加载中...</h1>
        </div>
    );
}

export default function PostsNewPage() {
    return (
        <Suspense fallback={<PostViewSkeleton />}>
            <PostNewTab mode="new" />
        </Suspense>
    );
}
