// 文章管理界面 Tab 界面

"use client";

import Link from "next/link";
import { getKLogSDK } from "@/lib/api-request";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2, Menu, PlusIcon } from "lucide-react";

import { NumberedPagination } from "@/components/ui/pagination";
import PostsList from "@/components/dashboard/post/PostsList";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";
import {
    PostFilters,
    PostFiltersState,
} from "@/components/dashboard/filters/PostFilters";

// 文章管理界面 Tab 界面

export default function PostViewTab() {
    const { setSidebarOpen } = useSidebar();

    // 利用kLogSDK获取数据并分页展示
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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

    // 前端标题过滤（SDK无搜索API）
    const filteredPosts = useMemo(() => {
        if (!pageData?.data) return [];
        if (!filters.title) return pageData.data;
        return pageData.data.filter((post) =>
            post.title.toLowerCase().includes(filters.title.toLowerCase())
        );
    }, [pageData, filters.title]);

    return (
        <div className="flex flex-col gap-4 h-full pb-8 overflow-y-auto">
            {/* 顶部大标题 */}
            <header className="bg-background flex items-center justify-between px-4 md:px-8 py-4 h-16 border-b-2 border-border sticky top-0 z-8">
                <div className="inline-flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                        aria-label="打开菜单"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={16} />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold text-primary">
                        我的文章
                    </h1>
                </div>
            </header>
            <div className="container mx-auto px-2 md:px-4 space-y-4 flex-1">
                {/* 筛选器 */}
                <PostFilters
                    categories={categories || []}
                    onFilterChange={setFilters}
                />

                {/* 中间文字管理列表区域 */}
                <section className="flex flex-col">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-red-500">{error.message}</p>
                        </div>
                    ) : (
                        <>
                            {/* 结果统计 */}
                            <p className="mb-4 text-sm text-secondary">
                                📊 找到 {filteredPosts.length} 篇文章
                            </p>

                            {filteredPosts.length > 0 ? (
                                <>
                                    <PostsList posts={filteredPosts} />
                                    <div className="h-1 bg-transparent border-b-2 border-border w-full my-4" />
                                    <NumberedPagination
                                        currentPage={currentPage}
                                        totalPages={pageData?.total || 0}
                                        onPageChange={setCurrentPage}
                                        className="self-end mx-4 w-auto"
                                    />
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="md:text-xl">暂无数据</p>
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* 底部新建文章 */}
                <div className="w-full flex items-center justify-center gap-4 md:justify-start self-end md:px-8">
                    <Link href="/dashboard/posts/new">
                        <Button variant="primary">
                            <PlusIcon className="w-4 h-4 mr-2" />
                            新建文章
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
