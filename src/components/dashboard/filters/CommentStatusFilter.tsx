// 评论状态筛选器组件

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CommentStatus = "all" | "pending" | "approved" | "spam";

export interface CommentStatusCounts {
    all: number;
    pending: number;
    approved: number;
    spam: number;
}

export interface CommentStatusFilterProps {
    currentStatus: CommentStatus;
    onStatusChange: (status: CommentStatus) => void;
    counts: CommentStatusCounts;
    className?: string;
}

const statusOptions: {
    value: CommentStatus;
    label: string;
    emoji: string;
}[] = [
    { value: "all", label: "全部", emoji: "📝" },
    { value: "pending", label: "待审核", emoji: "⏳" },
    { value: "approved", label: "已通过", emoji: "✅" },
    { value: "spam", label: "垃圾评论", emoji: "🗑️" },
];

export function CommentStatusFilter({
    currentStatus,
    onStatusChange,
    counts,
    className,
}: CommentStatusFilterProps) {
    return (
        <div className={cn("flex flex-wrap gap-4", className)}>
            {statusOptions.map((option) => (
                <Button
                    variant={
                        currentStatus === option.value ? "default" : "outline"
                    }
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                >
                    {option.emoji} {option.label} ({counts[option.value]})
                </Button>
            ))}
        </div>
    );
}
