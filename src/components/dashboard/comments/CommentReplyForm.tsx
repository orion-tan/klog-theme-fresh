// 评论回复表单组件

"use client";

import { useState } from "react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CommentReplyFormProps {
    onSubmit: (content: string) => Promise<void>;
    onCancel: () => void;
    className?: string;
}

export function CommentReplyForm({
    onSubmit,
    onCancel,
    className,
}: CommentReplyFormProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent("");
        } catch (error) {
            console.error("回复失败:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "mt-4 p-4 border-2 border-border bg-background",
                className
            )}
        >
            <FloatingLabelInput
                label="回复内容"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入回复内容..."
            />
            <div className="flex gap-2 mt-4">
                <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !content.trim()}
                >
                    {isSubmitting ? "提交中..." : "发送回复"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                >
                    取消
                </Button>
            </div>
        </form>
    );
}
