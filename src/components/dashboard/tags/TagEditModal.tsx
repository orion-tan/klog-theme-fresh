// 标签编辑弹窗组件

"use client";

import { useState, useEffect } from "react";
import type { Tag, TagCreateRequest } from "klog-sdk";
import slugify from "slugify";
import { Modal } from "@/components/ui/modal";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";

export interface TagEditModalProps {
    tag?: Tag; // undefined 表示新建
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TagCreateRequest) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

export function TagEditModal({
    tag,
    isOpen,
    onClose,
    onSave,
    onDelete,
}: TagEditModalProps) {
    const [name, setName] = useState(tag?.name || "");
    const [slug, setSlug] = useState(tag?.slug || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 重置表单（当tag或isOpen变化时）
    useEffect(() => {
        if (isOpen) {
            setName(tag?.name || "");
            setSlug(tag?.slug || "");
            setError(null);
        }
    }, [tag, isOpen]);

    // 自动生成 slug（仅在新建时）
    useEffect(() => {
        if (!tag && name) {
            setSlug(slugify(name, { lower: true, strict: true }));
        }
    }, [name, tag]);

    const handleSave = async () => {
        if (!name || !slug) {
            setError("标签名称和 Slug 不能为空");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSave({ name, slug });
            onClose();
        } catch (err) {
            setError((err as Error).message || "保存失败");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!tag || !onDelete) return;
        if (!confirm(`确定删除标签「${tag.name}」吗？`)) return;

        setIsSubmitting(true);
        setError(null);
        try {
            await onDelete(tag.id);
            onClose();
        } catch (err) {
            setError((err as Error).message || "删除失败");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={tag ? "编辑标签" : "新建标签"}
            style={
                {
                    viewTransitionName: tag ? `tag-${tag.id}` : undefined,
                } as React.CSSProperties
            }
        >
            <div className="flex flex-col gap-4">
                {/* 错误提示 */}
                {error && (
                    <div className="p-3 border-2 border-red-500 bg-red-500/10 text-red-500">
                        {error}
                    </div>
                )}

                {/* 标签名称 */}
                <FloatingLabelInput
                    variant="outline"
                    label="标签名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：React"
                    disabled={isSubmitting}
                />

                {/* Slug */}
                <FloatingLabelInput
                    variant="outline"
                    label="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="例如：react"
                    disabled={isSubmitting}
                />

                {/* 操作按钮 */}
                <div className="flex gap-2 mt-2">
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting || !name || !slug}
                    >
                        {isSubmitting ? "保存中..." : "保存"}
                    </Button>

                    {tag && onDelete && (
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            删除
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        取消
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
