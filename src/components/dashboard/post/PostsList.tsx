"use client";

// 文章管理列表表格
import type { Post } from "klog-sdk";
import Link from "next/link";
import {
    CalendarIcon,
    PencilIcon,
    TrashIcon,
    MessageCircleMore,
} from "lucide-react";

import Bage from "@/components/ui/bage";
import { cn } from "@/lib/utils";
import { getKLogSDK } from "@/lib/api-request";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface PostsTableProps {
    posts: Post[];
    className?: string;
}

export default function PostsList({ posts, className }: PostsTableProps) {
    const klogSdk = getKLogSDK();
    const queryClient = useQueryClient();

    const handleDelete = async (id: number) => {
        try {
            await klogSdk.posts.deletePost(id);
            queryClient.invalidateQueries({ queryKey: ["posts:all"] });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        // 表格宽度自适应，超出添加滚动条
        <div className={cn("w-full flex flex-col gap-4", className)}>
            {posts.map((post) => (
                <article
                    key={post.id}
                    className="border-2 border-border p-4 flex flex-col md:flex-row justify-between gap-4 rounded-md"
                >
                    {/* 左侧元数据 */}
                    <div className="flex flex-col gap-4">
                        {/* 顶部标题 */}
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-xl text-clip">
                                {post.title}
                            </span>
                            <Bage
                                label={
                                    post.status === "published"
                                        ? "已发布"
                                        : "草稿"
                                }
                                variant={
                                    post.status === "published"
                                        ? "success"
                                        : "warning"
                                }
                            />
                        </div>
                        {/* 简介 */}
                        <div>
                            {post.excerpt && post.excerpt.length > 0 ? (
                                <p className="text-clip">{post.excerpt}</p>
                            ) : (
                                <p className="text-clip">
                                    不知道写的什么东西 ...
                                </p>
                            )}
                        </div>
                        {/* 标签 */}

                        {/* 最多显示三个标签，更多用 +x 表示 */}
                        <div className="inline-flex items-center gap-2">
                            {post.tags?.slice(0, 3).map((tag) => (
                                <Link
                                    href={`/dashboard/tags/${tag.id}`}
                                    key={tag.id}
                                >
                                    <Bage
                                        key={tag.id}
                                        label={tag.name}
                                        variant="outline"
                                    />
                                </Link>
                            ))}
                            {post.tags?.length && post.tags.length > 3 && (
                                <Link
                                    href={`/dashboard/tags`}
                                    key={`more-${post.id}`}
                                >
                                    <Bage
                                        label={`+${post.tags.length - 3}`}
                                        variant="outline"
                                    />
                                </Link>
                            )}
                        </div>

                        {/* 横向的创建和更新时间 */}
                        <div className="inline-flex items-center gap-4">
                            <span className="inline-flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {
                                    new Date(post.created_at)
                                        .toLocaleString()
                                        .split(" ")[0]
                                }
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {
                                    new Date(post.updated_at)
                                        .toLocaleString()
                                        .split(" ")[0]
                                }
                            </span>
                        </div>
                    </div>
                    {/* 右侧操作 */}
                    <div>
                        <div className="inline-flex items-center gap-2 flex-wrap">
                            <Link
                                href={`/dashboard/posts/edit/${post.id}`}
                                key={`edit-${post.id}`}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-primary"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    编辑
                                </Button>
                            </Link>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                                className="text-error"
                            >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                删除
                            </Button>

                            <Link
                                href={`/dashboard/posts/comments/${post.id}`}
                                key={`comments-${post.id}`}
                            >
                                <Button variant="outline" size="sm">
                                    <MessageCircleMore className="w-4 h-4 mr-2" />
                                    评论
                                </Button>
                            </Link>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
