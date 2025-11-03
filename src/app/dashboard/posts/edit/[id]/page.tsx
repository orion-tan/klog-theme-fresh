import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import PostEditTab from "@/components/dashboard/tabs/PostEditTab";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: `${siteConfig.title} | 编辑文章`,
    description: "编辑文章",
};

function PostEditSkeleton() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-center">加载中...</h1>
        </div>
    );
}

interface PostEditPageProps {
    params: {
        id: string;
    };
}

export default function PostEditPage({ params }: PostEditPageProps) {
    return (
        <div className="bg-background-1 text-foreground h-full py-8">
            <Suspense fallback={<PostEditSkeleton />}>
                <PostEditTab mode="edit" postId={params.id} />
            </Suspense>
        </div>
    );
}

