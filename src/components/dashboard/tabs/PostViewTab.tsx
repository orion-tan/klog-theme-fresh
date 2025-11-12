// 文章管理界面 Tab 界面

"use client";

import Link from "next/link";
import { getKLogSDK } from "@/lib/api-request";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2, Plus, FileText, Search, AlertCircle } from "lucide-react";

import PostsTable from "@/components/dashboard/post/PostsTable";
import { Button } from "@/components/mui/button";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/mui/breadcrumb";
import {
    PostFilters,
    PostFiltersState,
} from "@/components/dashboard/filters/PostFilters";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
} from "@/components/mui/empty";

// 文章管理界面 Tab 界面

export default function PostViewTab() {
    // 利用kLogSDK获取数据并分页展示
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, _setPageSize] = useState(5);
    const [filters, setFilters] = useState<PostFiltersState>({
        title: "",
        category: undefined,
        status: undefined,
    });

    const klogSdk = getKLogSDK();

    // 获取分类列表（用于筛选器）
    const { data: categories } = useQuery({
        queryKey: ["categories:all"],
        queryFn: () => klogSdk.categories.getCategories(),
    });

    const {
        data: pageData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "posts",
            currentPage,
            pageSize,
            filters.category,
            filters.status,
        ],
        queryFn: () =>
            klogSdk.posts.getPosts({
                page: currentPage,
                limit: pageSize,
                category: filters.category?.toString(),
                status: filters.status,
                sortBy: "created_at",
                order: "desc",
            }),
    });

    // 前端标题过滤
    const filteredPosts = useMemo(() => {
        if (!pageData?.data) return [];
        if (!filters.title) return pageData.data;
        return pageData.data.filter((post) =>
            post.title.toLowerCase().includes(filters.title.toLowerCase())
        );
    }, [pageData, filters.title]);

    // 判断是否有过滤条件
    const hasActiveFilters = useMemo(() => {
        return !!(
            filters.title ||
            filters.category !== undefined ||
            filters.status !== undefined
        );
    }, [filters]);

    // 判断是否为过滤后无结果
    const isFilteredEmpty = useMemo(() => {
        return (
            hasActiveFilters &&
            filteredPosts.length === 0 &&
            (pageData?.data?.length ?? 0) > 0
        );
    }, [hasActiveFilters, filteredPosts.length, pageData?.data?.length]);

    return (
        <div className="flex flex-col gap-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">概览</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>文章管理</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">
                            所有文章
                        </h3>
                        <p className="text-muted-foreground mt-1">
                            管理和编辑您的博客文章
                        </p>
                    </div>
                    <Link href="/admin/posts/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            新建文章
                        </Button>
                    </Link>
                </div>
                <PostFilters
                    categories={categories ?? []}
                    onFilterChange={setFilters}
                />
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">
                            正在加载文章...
                        </p>
                    </div>
                ) : error ? (
                    <Empty className="py-12">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                            </EmptyMedia>
                            <EmptyTitle>加载失败</EmptyTitle>
                            <EmptyDescription>
                                {error instanceof Error
                                    ? error.message
                                    : "加载文章时发生错误，请稍后重试"}
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    refetch();
                                }}
                            >
                                重新加载
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : isFilteredEmpty ? (
                    <Empty className="py-12">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Search className="h-6 w-6 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>未找到匹配的文章</EmptyTitle>
                            <EmptyDescription>
                                当前筛选条件下没有找到匹配的文章，请尝试调整筛选条件。
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setFilters({
                                        title: "",
                                        category: undefined,
                                        status: undefined,
                                    });
                                }}
                            >
                                清除筛选条件
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : filteredPosts.length === 0 ? (
                    <Empty className="py-12">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>暂无文章</EmptyTitle>
                            <EmptyDescription>
                                您还没有创建任何文章，点击下方按钮创建您的第一篇文章。
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Link href="/admin/posts/new">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    新建文章
                                </Button>
                            </Link>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <PostsTable posts={filteredPosts} />
                )}
            </div>
        </div>
    );
}
