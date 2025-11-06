// 文章管理界面 Tab 界面

"use client";

import Link from "next/link";
import { getKLogSDK } from "@/lib/api-request";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Menu, PlusIcon } from "lucide-react";

import { NumberedPagination } from "@/components/ui/pagination";
import PostsList from "@/components/dashboard/PostsList";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";

// 文章管理界面 Tab 界面

export default function PostViewTab() {
    const { setSidebarOpen } = useSidebar();

    // 利用kLogSDK获取数据并分页展示
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        data: pageData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["posts", currentPage, pageSize],
        queryFn: () =>
            getKLogSDK().posts.getPosts({
                page: currentPage,
                limit: pageSize,
                sortBy: "created_at",
                order: "desc",
            }),
    });

    return (
        <div className="flex flex-col gap-4 h-full pb-8">
            {/* 顶部大标题 */}
            <header className="flex items-center justify-between px-4 md:px-8 h-16 border-b-2 border-border sticky top-0 z-10">
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
            {/* 中间文字管理列表区域 */}
            <section className="flex-1 overflow-y-auto p-4 mt-8 flex flex-col">
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
                        {(pageData?.total || 0) > 0 ? (
                            <>
                                <PostsList posts={pageData?.data || []} />
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
    );
}
