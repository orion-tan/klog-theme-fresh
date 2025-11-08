// 分类新建/编辑弹窗组件

"use client";

import { useState, useEffect } from "react";
import type { CategoryCreateRequest } from "klog-sdk";
import slugify from "slugify";
import { Modal } from "@/components/ui/modal";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";

export interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CategoryCreateRequest) => Promise<void>;
}

export function CategoryModal({ isOpen, onClose, onSave }: CategoryModalProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 重置表单
    useEffect(() => {
        if (isOpen) {
            setName("");
            setSlug("");
            setDescription("");
            setError(null);
        }
    }, [isOpen]);

    // 自动生成 slug
    useEffect(() => {
        if (name) {
            setSlug(slugify(name, { lower: true, strict: true }));
        }
    }, [name]);

    const handleSave = async () => {
        if (!name || !slug) {
            setError("分类名称和 Slug 不能为空");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await onSave({ name, slug, description });
            onClose();
        } catch (err) {
            setError((err as Error).message || "保存失败");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="新建分类">
            <div className="flex flex-col gap-4">
                {/* 错误提示 */}
                {error && (
                    <div className="p-3 border-2 border-red-500 bg-red-500/10 text-red-500">
                        {error}
                    </div>
                )}

                {/* 分类名称 */}
                <FloatingLabelInput
                    variant="outline"
                    label="分类名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：技术博客"
                    disabled={isSubmitting}
                />

                {/* Slug */}
                <FloatingLabelInput
                    variant="outline"
                    label="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="例如：tech-blog"
                    disabled={isSubmitting}
                />

                {/* 描述 */}
                <FloatingLabelInput
                    variant="outline"
                    label="描述（可选）"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="简要描述这个分类..."
                    disabled={isSubmitting}
                />

                {/* 操作按钮 */}
                <div className="flex gap-2 mt-2">
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting || !name || !slug}
                    >
                        {isSubmitting ? "创建中..." : "创建"}
                    </Button>

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
