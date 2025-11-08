// 标签云组件

"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { Tag } from "klog-sdk";
import { cn } from "@/lib/utils";

export interface TagCloudProps {
    tags: Tag[];
    onTagClick: (tag: Tag) => void;
    className?: string;
}

export function TagCloud({ tags, onTagClick, className }: TagCloudProps) {
    const tagSizes = useMemo(() => {
        const sizes = new Map<number, number>();
        tags.forEach((tag) => {
            const size = 14 + ((tag.id * 7) % 15);
            sizes.set(tag.id, size);
        });
        return sizes;
    }, [tags]);

    const handleTagClick = (tag: Tag) => {
        if (!document.startViewTransition) {
            onTagClick(tag);
            return;
        }

        document.startViewTransition(() => {
            onTagClick(tag);
        });
    };

    return (
        <div
            className={cn(
                "flex flex-wrap gap-4 p-8 justify-center items-center",
                className
            )}
        >
            {tags.map((tag) => {
                const fontSize = tagSizes.get(tag.id) || 16;

                return (
                    <motion.button
                        key={tag.id}
                        data-tag-id={tag.id}
                        className={cn(
                            "px-4 py-2 border-2 border-border",
                            "shadow-[2px_2px_0_0_var(--border)]"
                        )}
                        style={{
                            fontSize: `${fontSize}px`,
                            viewTransitionName: `tag-${tag.id}` as any,
                        }}
                        whileHover={{
                            backgroundColor: "var(--primary)",
                            boxShadow: "4px 4px 0 0 var(--border)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag.name}
                    </motion.button>
                );
            })}
        </div>
    );
}
