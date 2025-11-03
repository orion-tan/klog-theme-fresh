// 文章管理界面 Tab 界面

"use client";

import Link from "next/link";
import { getKLogSDK } from "@/lib/api-request";
import { useQuery } from "@tanstack/react-query";

import { NumberedPagination } from "@/components/ui/pagination";
import PostsTable from "@/components/dashboard/PostsTable";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// 文章管理界面 Tab 界面

export default function PostViewTab() {
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
        <div className="flex flex-col gap-4 h-full">
            {/* 顶部大标题 */}
            <section className="flex flex-col md:flex-row items-start md:items-center md:justify-between mt-8 px-4 md:px-8">
                <h1 className="text-2xl font-bold text-primary">我的文章</h1>
                <p className="text-primary/90">
                    文章管理界面 Tab 界面，可以在这里管理你的文章
                </p>
            </section>
            {/* 中间文字管理列表区域 */}
            <section className="flex-1 overflow-y-auto p-4 mt-12">
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
                                <PostsTable posts={pageData?.data || []} />
                                <NumberedPagination
                                    currentPage={currentPage}
                                    totalPages={pageData?.total || 0}
                                    onPageChange={setCurrentPage}
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
                    <button className="bg-primary px-4 py-2 rounded-full">
                        新建文章
                    </button>
                </Link>
            </div>
        </div>
    );
}
