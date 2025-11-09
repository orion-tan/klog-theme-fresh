// 标签管理页面

"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Loader2, Menu } from "lucide-react";
import type { Tag, TagCreateRequest } from "klog-sdk";

import { getKLogSDK } from "@/lib/api-request";
import { Button } from "@/components/ui/button";
import { TagCloud } from "@/components/dashboard/tags/TagCloud";
import { TagEditModal } from "@/components/dashboard/tags/TagEditModal";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";
import TabLayout from "@/components/dashboard/tabs/TabLayout";

export default function TagsViewTab() {
    const klogSdk = getKLogSDK();
    const queryClient = useQueryClient();
    const { setSidebarOpen } = useSidebar();

    const [selectedTag, setSelectedTag] = useState<Tag | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 获取标签列表
    const {
        data: tags,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["tags:all"],
        queryFn: () => klogSdk.tags.getTags(),
    });

    // 新建标签
    const handleCreate = () => {
        setSelectedTag(undefined);
        setIsModalOpen(true);
    };

    // 编辑标签
    const handleEdit = (tag: Tag) => {
        setSelectedTag(tag);
        setIsModalOpen(true);
    };

    // 保存标签
    const handleSave = async (data: TagCreateRequest) => {
        if (selectedTag) {
            await klogSdk.tags.updateTag(selectedTag.id, data);
        } else {
            await klogSdk.tags.createTag(data);
        }
        queryClient.invalidateQueries({ queryKey: ["tags:all"] });
    };

    // 删除标签
    const handleDelete = async (id: number) => {
        await klogSdk.tags.deleteTag(id);
        queryClient.invalidateQueries({ queryKey: ["tags:all"] });
        setIsModalOpen(false);
    };

    return (
        <TabLayout
            title="标签管理"
            onSidebarMenuClick={() => setSidebarOpen(true)}
        >
            {/* 统计信息 */}
            <div className="">
                <p className="text-sm text-secondary">
                    共 {tags?.length || 0} 个标签
                </p>
            </div>

            {/* 标签云 */}
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
                ) : tags?.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-secondary">
                            暂无标签，点击&ldquo;新建标签&rdquo;创建第一个标签
                        </p>
                    </div>
                ) : (
                    <div className="border-2 border-border min-h-[400px] max-h-[500px] flex items-center justify-center rounded-md">
                        <TagCloud tags={tags || []} onTagClick={handleEdit} />
                    </div>
                )}
            </div>

            {/* 编辑弹窗 */}
            <TagEditModal
                tag={selectedTag}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                onDelete={selectedTag ? handleDelete : undefined}
            />
            <Button onClick={handleCreate}>
                <PlusIcon className="w-4 h-4 mr-2" />
                新建标签
            </Button>
        </TabLayout>
    );
}
