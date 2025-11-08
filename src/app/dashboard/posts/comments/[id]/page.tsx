// 评论管理页面

import { Metadata } from "next";

import PostCommentViewTab from "@/components/dashboard/tabs/CommentViewTab";

export const metadata: Metadata = {
    title: "KLog | 评论管理",
    description: "评论管理页面",
};

interface PostCommentsPageProps {
    params: { id: string };
}

export default async function PostCommentsPage({
    params,
}: PostCommentsPageProps) {
    const { id } = await params;
    return (
        <div className="p-4 md:p-8 bg-background-1 h-full max-h-screen overflow-hidden">
            <PostCommentViewTab id={Number(id)} />
        </div>
    );
}
