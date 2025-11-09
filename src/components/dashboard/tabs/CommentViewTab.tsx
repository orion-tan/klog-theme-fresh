// 评论管理页面

"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Loader2, Menu } from "lucide-react";

import { getKLogSDK } from "@/lib/api-request";
import {
    CommentStatusFilter,
    CommentStatus,
} from "@/components/dashboard/filters/CommentStatusFilter";
import { CommentItem } from "@/components/dashboard/comments/CommentItem";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";

interface PostCommentViewTabProps {
    id: number;
}

export default function PostCommentViewTab({ id }: PostCommentViewTabProps) {
    const { setSidebarOpen } = useSidebar();
    const klogSdk = getKLogSDK();
    const queryClient = useQueryClient();

    const [statusFilter, setStatusFilter] = useState<CommentStatus>("all");

    // 获取文章信息
    const { data: post } = useQuery({
        queryKey: ["posts", id],
        queryFn: () => klogSdk.posts.getPost(id),
    });

    // 获取评论列表
    const {
        data: comments,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["comments", id],
        queryFn: () => klogSdk.comments.getCommentsByPostId(id),
    });

    // 前端过滤（按状态）
    const filteredComments = useMemo(() => {
        if (!comments) return [];
        if (statusFilter === "all") return comments;
        return comments.filter((c) => c.status === statusFilter);
    }, [comments, statusFilter]);

    // 只获取顶级评论（没有parent_id的）
    const topLevelComments = useMemo(() => {
        return filteredComments.filter((c) => !c.parent_id);
    }, [filteredComments]);

    // 统计各状态数量
    const statusCounts = useMemo(() => {
        if (!comments) {
            return { all: 0, pending: 0, approved: 0, spam: 0 };
        }
        return {
            all: comments.length,
            pending: comments.filter((c) => c.status === "pending").length,
            approved: comments.filter((c) => c.status === "approved").length,
            spam: comments.filter((c) => c.status === "spam").length,
        };
    }, [comments]);

    // 操作处理
    const handleApprove = async (id: number) => {
        try {
            await klogSdk.comments.updateCommentStatus(id, {
                status: "approved",
            });
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        } catch (error) {
            console.error("审核失败:", error);
            alert("审核失败，请重试");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await klogSdk.comments.updateCommentStatus(id, { status: "spam" });
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        } catch (error) {
            console.error("标记失败:", error);
            alert("标记失败，请重试");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await klogSdk.comments.deleteComment(id);
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        } catch (error) {
            console.error("删除失败:", error);
            alert("删除失败，请重试");
        }
    };

    const handleReply = async (parentId: number, content: string) => {
        try {
            await klogSdk.comments.createComment(id, {
                content,
                parent_id: parentId,
            });
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        } catch (error) {
            console.error("回复失败:", error);
            alert("回复失败，请重试");
        }
    };

    return (
        <div className="bg-background flex flex-col h-full gap-4 pb-4 overflow-y-auto">
            {/* 顶部导航 */}
            <header className="bg-background flex items-center justify-between py-4 px-4 md:px-8 h-16 border-b-2 border-border sticky top-0 z-8">
                <div className="inline-flex items-center gap-4 w-full">
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                        aria-label="打开菜单"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={16} />
                    </Button>
                    <Link href="/dashboard/posts">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回文章列表
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-2 md:px-4 space-y-4 flex-1">
                <p className="text-xl md:text-2xl font-bold text-primary">
                    《{post?.title || "加载中..."}》的评论管理
                </p>

                {/* 状态筛选 */}
                <div className="mb-6 pb-4 border-b-2 border-border">
                    <CommentStatusFilter
                        currentStatus={statusFilter}
                        onStatusChange={setStatusFilter}
                        counts={statusCounts}
                    />
                </div>

                {/* 评论列表 */}
                <div className="bg-surface border-2 border-border p-4 md:p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-red-500">
                                加载失败: {(error as Error).message}
                            </p>
                        </div>
                    ) : topLevelComments.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-secondary">
                                {statusFilter === "all"
                                    ? "暂无评论"
                                    : `暂无${
                                          statusFilter === "pending"
                                              ? "待审核"
                                              : statusFilter === "approved"
                                              ? "已通过"
                                              : "垃圾"
                                      }评论`}
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="mb-4 text-sm text-secondary">
                                📊 找到 {topLevelComments.length} 条顶级评论
                            </p>
                            <div>
                                {topLevelComments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        onDelete={handleDelete}
                                        onReply={handleReply}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
