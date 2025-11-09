// 文章管理界面 Tab 界面

"use client";

import Link from "next/link";
import { getKLogSDK } from "@/lib/api-request";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2, PlusIcon } from "lucide-react";

import TabLayout from "@/components/dashboard/tabs/TabLayout";
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

    return (
        <TabLayout
            title="我的文章"
            onSidebarMenuClick={() => setSidebarOpen(true)}
        >
            {/* 顶部新建文章 */}
            <div className="w-full flex items-center justify-center gap-4 md:justify-start self-end">
                <Link href="/dashboard/posts/new">
                    <Button variant="primary">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        新建文章
                    </Button>
                </Link>
            </div>
            {/* 筛选器 */}
            <PostFilters
                categories={categories || []}
                onFilterChange={setFilters}
                className="shrink-0"
            />

            {/* 中间文字管理列表区域 */}
            <section className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-thin">
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
                            找到 {filteredPosts.length} 篇文章
                        </p>

                        {filteredPosts.length > 0 ? (
                            <>
                                <PostsList posts={filteredPosts} />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="md:text-xl">暂无数据</p>
                            </div>
                        )}
                    </>
                )}
            </section>
            {filteredPosts.length > 0 && (
                <NumberedPagination
                    currentPage={currentPage}
                    totalPages={
                        pageData
                            ? pageData.total % pageSize === 0
                                ? pageData.total / pageSize
                                : Math.floor(pageData.total / pageSize) + 1
                            : 0
                    }
                    onPageChange={setCurrentPage}
                    className="self-end mx-4 w-auto mt-4"
                />
            )}
        </TabLayout>
    );
}
