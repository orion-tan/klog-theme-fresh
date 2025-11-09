// 文章筛选器组件

"use client";

import { useState, useEffect } from "react";
import type { Category } from "klog-sdk";
import { Select } from "@/components/ui/select";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PostFiltersState {
    title: string;
    category?: number;
    status?: "draft" | "published" | "archived";
}

export interface PostFiltersProps {
    categories: Category[];
    onFilterChange: (filters: PostFiltersState) => void;
    className?: string;
}

export function PostFilters({
    categories,
    onFilterChange,
    className,
}: PostFiltersProps) {
    const [filters, setFilters] = useState<PostFiltersState>({
        title: "",
        category: undefined,
        status: undefined,
    });

    // 防抖搜索
    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange(filters);
        }, 300);

        return () => clearTimeout(timer);
    }, [filters, onFilterChange]);

    const handleReset = () => {
        setFilters({
            title: "",
            category: undefined,
            status: undefined,
        });
    };

    const categoryOptions = [
        { label: "全部分类", value: "" },
        ...categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
        })),
    ];

    const statusOptions = [
        { label: "全部状态", value: "" },
        { label: "草稿", value: "draft" },
        { label: "已发布", value: "published" },
        { label: "归档", value: "archived" },
    ];

    return (
        <div
            className={cn(
                "border-2 border-border p-4 rounded-md",
                "flex flex-col gap-4",
                className
            )}
        >
            {/* 标题 */}
            <h3 className="text-lg font-bold">筛选条件</h3>

            {/* 筛选条件 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 标题搜索 */}
                <FloatingLabelInput
                    label="搜索标题"
                    variant="outline"
                    value={filters.title}
                    onChange={(e) =>
                        setFilters({ ...filters, title: e.target.value })
                    }
                />

                {/* 分类筛选 */}
                <Select
                    label="分类"
                    value={filters.category || ""}
                    options={categoryOptions}
                    onValueChange={(value) =>
                        setFilters({
                            ...filters,
                            category: value ? Number(value) : undefined,
                        })
                    }
                />

                {/* 状态筛选 */}
                <Select
                    label="状态"
                    value={filters.status || ""}
                    options={statusOptions}
                    onValueChange={(value) =>
                        setFilters({
                            ...filters,
                            status: value
                                ? (value as "draft" | "published" | "archived")
                                : undefined,
                        })
                    }
                />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={handleReset}>
                    重置
                </Button>
            </div>
        </div>
    );
}
