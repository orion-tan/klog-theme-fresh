// 递归评论项组件

"use client";

import { useState } from "react";
import type { Comment } from "klog-sdk";
import { Button } from "@/components/ui/button";
import Bage from "@/components/ui/bage";
import { CommentReplyForm } from "./CommentReplyForm";

export interface CommentItemProps {
    comment: Comment;
    depth?: number;
    onApprove: (id: number) => Promise<void>;
    onReject: (id: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onReply: (parentId: number, content: string) => Promise<void>;
}

export function CommentItem({
    comment,
    depth = 0,
    onApprove,
    onReject,
    onDelete,
    onReply,
}: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("确定删除这条评论吗？")) return;
        setIsDeleting(true);
        try {
            await onDelete(comment.id);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReply = async (content: string) => {
        await onReply(comment.id, content);
        setIsReplying(false);
    };

    // 最多缩进2层
    const indentLevel = Math.min(depth, 2);

    return (
        <div className="mb-4" style={{ marginLeft: `${indentLevel * 32}px` }}>
            <div className="border-2 border-border p-4 bg-background-1">
                {/* 评论头部：作者、邮箱、时间、状态 */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-lg">
                                {comment.name}
                            </span>
                            <span className="text-sm text-secondary">
                                {comment.email}
                            </span>
                        </div>
                        <span className="text-xs text-secondary">
                            {new Date(comment.created_at).toLocaleString(
                                "zh-CN",
                                {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                        </span>
                    </div>
                    <Bage
                        label={
                            comment.status === "pending"
                                ? "待审核"
                                : comment.status === "approved"
                                ? "已通过"
                                : "垃圾评论"
                        }
                        variant={
                            comment.status === "pending"
                                ? "warning"
                                : comment.status === "approved"
                                ? "success"
                                : "danger"
                        }
                    />
                </div>

                {/* 评论内容 */}
                <p className="my-4 text-foreground whitespace-pre-wrap wrap-break-words">
                    {comment.content}
                </p>

                {/* 操作按钮 */}
                <div className="flex gap-2 flex-wrap">
                    {comment.status === "pending" && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onApprove(comment.id)}
                        >
                            ✓ 通过
                        </Button>
                    )}
                    {comment.status !== "spam" && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject(comment.id)}
                        >
                            ✗ 标为垃圾
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "删除中..." : "🗑️ 删除"}
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        💬 回复
                    </Button>
                </div>

                {/* 回复表单 */}
                {isReplying && (
                    <CommentReplyForm
                        onSubmit={handleReply}
                        onCancel={() => setIsReplying(false)}
                    />
                )}
            </div>

            {/* 递归渲染子回复 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            onApprove={onApprove}
                            onReject={onReject}
                            onDelete={onDelete}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
