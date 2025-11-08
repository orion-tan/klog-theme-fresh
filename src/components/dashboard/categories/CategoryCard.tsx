// 分类卡片组件（支持查看/编辑模式）

"use client";

import { useState } from "react";
import type { Category, CategoryUpdateRequest } from "klog-sdk";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
    category: Category;
    onUpdate: (id: number, data: CategoryUpdateRequest) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    className?: string;
}

export function CategoryCard({
    category,
    onUpdate,
    onDelete,
    className,
}: CategoryCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [slug, setSlug] = useState(category.slug);
    const [description, setDescription] = useState(category.description || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await onUpdate(category.id, { name, slug, description });
            setIsEditing(false);
        } catch (error) {
            console.error("更新失败:", error);
            alert("更新失败，请重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setName(category.name);
        setSlug(category.slug);
        setDescription(category.description || "");
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!confirm(`确定删除分类「${category.name}」吗？`)) return;

        setIsSubmitting(true);
        try {
            await onDelete(category.id);
        } catch (error) {
            console.error("删除失败:", error);
            alert("删除失败，请重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className={cn(
                "border-2 border-border p-4 bg-background-1 transition-all",
                "shadow-[2px_2px_0_0_var(--border)]",
                className
            )}
        >
            {!isEditing ? (
                /* 查看模式 */
                <>
                    <h3 className="text-xl font-bold mb-2 text-primary">
                        {category.name}
                    </h3>
                    <p className="text-sm text-secondary mb-2 font-mono">
                        {category.slug}
                    </p>
                    <p className="text-sm line-clamp-3 mb-4 min-h-[60px]">
                        {category.description || "无描述"}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            disabled={isSubmitting}
                        >
                            编辑
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "删除中..." : "删除"}
                        </Button>
                    </div>
                </>
            ) : (
                /* 编辑模式 */
                <>
                    <FloatingLabelInput
                        variant="outline"
                        label="分类名称"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-3"
                        disabled={isSubmitting}
                    />
                    <FloatingLabelInput
                        variant="outline"
                        label="Slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="mb-3"
                        disabled={isSubmitting}
                    />
                    <FloatingLabelInput
                        variant="outline"
                        label="描述"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mb-4"
                        disabled={isSubmitting}
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSubmitting || !name || !slug}
                        >
                            {isSubmitting ? "保存中..." : "保存"}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            取消
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
