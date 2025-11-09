// 分类管理页面

"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Loader2, Menu } from "lucide-react";
import type { CategoryCreateRequest, CategoryUpdateRequest } from "klog-sdk";
import { getKLogSDK } from "@/lib/api-request";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/dashboard/categories/CategoryCard";
import { CategoryModal } from "@/components/dashboard/categories/CategoryModal";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";
import TabLayout from "@/components/dashboard/tabs/TabLayout";

export default function CategoriesViewTab() {
    const klogSdk = getKLogSDK();
    const queryClient = useQueryClient();
    const { setSidebarOpen } = useSidebar();

    const [isCreating, setIsCreating] = useState(false);

    // 获取分类列表
    const {
        data: categories,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["categories:all"],
        queryFn: () => klogSdk.categories.getCategories(),
    });

    // 更新分类
    const handleUpdate = async (id: number, data: CategoryUpdateRequest) => {
        await klogSdk.categories.updateCategory(id, data);
        queryClient.invalidateQueries({ queryKey: ["categories:all"] });
    };

    // 删除分类
    const handleDelete = async (id: number) => {
        await klogSdk.categories.deleteCategory(id);
        queryClient.invalidateQueries({ queryKey: ["categories:all"] });
    };

    // 创建分类
    const handleCreate = async (data: CategoryCreateRequest) => {
        await klogSdk.categories.createCategory(data);
        queryClient.invalidateQueries({ queryKey: ["categories:all"] });
        setIsCreating(false);
    };

    return (
        <TabLayout
            title="分类管理"
            onSidebarMenuClick={() => setSidebarOpen(true)}
        >
            <Button onClick={() => setIsCreating(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                新建分类
            </Button>
            {/* 统计信息 */}
            <div className="">
                <p className="text-sm text-secondary">
                    📊 共 {categories?.length || 0} 个分类
                </p>
            </div>

            {/* 分类网格 */}
            <div className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-red-500">
                            加载失败: {(error as Error).message}
                        </p>
                    </div>
                ) : categories?.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-secondary">
                            暂无分类，点击&ldquo;新建分类&rdquo;创建第一个分类
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories?.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 新建分类弹窗 */}
            <CategoryModal
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                onSave={handleCreate}
            />
        </TabLayout>
    );
}
