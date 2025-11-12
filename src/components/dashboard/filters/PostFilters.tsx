// 文章筛选器组件

"use client";

import { useState, useEffect } from "react";
import type { Category } from "klog-sdk";
import { Input } from "@/components/mui/input";
import { Card, CardContent, CardFooter } from "@/components/mui/card";
import { Combobox } from "@/components/mui/combobox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/mui/select";
import { Button } from "@/components/mui/button";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

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
        { label: "草稿", value: "draft" },
        { label: "已发布", value: "published" },
        { label: "归档", value: "archived" },
    ];

    return (
        <>
            <Card>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/90" />
                            <Input
                                placeholder="搜索标题"
                                value={filters.title}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        title: e.target.value,
                                    })
                                }
                                className="pl-9"
                            />
                        </div>
                        <div className="relative">
                            <Combobox
                                className="w-full"
                                options={categoryOptions}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, category: value })
                                }
                                searchPlaceholder="搜索分类"
                                selectPlaceholder="选择分类"
                            />
                        </div>
                        <div className="relative">
                            <Select>
                                <SelectTrigger className="w-full justify-between">
                                    <SelectValue placeholder="选择状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" onClick={handleReset}>
                        <X className="h-4 w-4 mr-2" />
                        重置
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
