// 文章编辑 Tab

"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { MarkdownEditorWrapper } from "@/components/ui/markdown-editor";
import { getKLogSDK } from "@/lib/api-request";
import { Category, KLogError, NetworkError, Post, Tag } from "klog-sdk";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Menu, UploadIcon } from "lucide-react";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import Link from "next/link";

const postsSchema = z.object({
    title: z
        .string()
        .min(1, "文章标题不能为空")
        .max(255, "文章标题不能超过 255 个字符"),
    slug: z
        .string()
        .min(1, "文章 slug 不能为空")
        .max(255, "文章 slug 不能超过 255 个字符"),
    cover_image_url: z
        .union([z.literal(""), z.string().pipe(z.url("文章封面链接格式错误"))])
        .optional(),
    content: z.string().min(1, "文章内容不能为空"),
    excerpt: z.string().max(768, "文章摘要不能超过 768 个字符").optional(),
    category_id: z.number().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published", "archived"]),
});

interface PostEditTabProps {
    postId: number;
}

export default function PostEditTab({ postId }: PostEditTabProps) {
    const klogSdk = getKLogSDK();

    // 1. 获取文章数据
    const {
        data: post,
        isLoading: isPostLoading,
        isError: isPostError,
        error: postError,
    } = useQuery({
        queryKey: ["post:detail", postId],
        queryFn: () => klogSdk.posts.getPost(postId),
        enabled: postId > 0,
    });

    // 获取分类与标签
    const { data: allCategories } = useQuery({
        queryKey: ["categories:all"],
        queryFn: () => klogSdk.categories.getCategories(),
    });
    const { data: allTags } = useQuery({
        queryKey: ["tags:all"],
        queryFn: () => klogSdk.tags.getTags(),
    });

    if (isPostLoading) {
        return <div className="p-8">正在加载文章数据...</div>;
    }

    if (isPostError) {
        return (
            <div className="p-8 text-red-500">
                加载文章失败：
                {postError instanceof Error
                    ? postError.message
                    : String(postError)}
            </div>
        );
    }

    if (!post) {
        return <div className="p-8">未找到文章数据。</div>;
    }

    return (
        <PostEditForm
            key={post.id}
            post={post}
            allCategories={allCategories}
            allTags={allTags}
        />
    );
}

function PostEditForm({
    post,
    allCategories,
    allTags,
}: {
    post: Post;
    allCategories: Category[] | undefined;
    allTags: Tag[] | undefined;
}) {
    const { setSidebarOpen } = useSidebar();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<
        "draft" | "published" | "archived"
    >("draft");

    const queryClient = useQueryClient();
    const klogSdk = getKLogSDK();

    const form = useForm({
        defaultValues: postsSchema.parse({
            title: post.title,
            slug: post.slug,
            cover_image_url:
                post.cover_image_url.length > 0
                    ? post.cover_image_url
                    : undefined,
            content: post.content,
            excerpt: post.excerpt.length > 0 ? post.excerpt : undefined,
            category_id: post.category_id ?? undefined,
            tags: post.tags?.map((tag) => tag.slug) ?? [],
            status: post.status,
        }),
        validators: {
            onChange: postsSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                setSubmitError(null);
                const payload = {
                    ...value,
                    category_id:
                        value.category_id === 0 ? null : value.category_id,
                    status: submitStatus,
                };

                await klogSdk.posts.updatePost(post.id, payload);

                queryClient.invalidateQueries({ queryKey: ["posts:all"] });
                queryClient.invalidateQueries({
                    queryKey: ["post:detail", post.id],
                });
            } catch (error) {
                if (error instanceof NetworkError) {
                    setSubmitError(`网络错误：${error.message}`);
                } else if (error instanceof KLogError) {
                    setSubmitError(`更新失败：${error.message}`);
                } else {
                    setSubmitError("更新失败：未知错误");
                }
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <div className="flex flex-col gap-4 h-full pb-4 overflow-y-auto">
                {/* 顶部大标题 */}
                <header className="bg-background flex items-center justify-between px-4 py-4 md:px-8 h-16 border-b-2 border-border sticky top-0 z-8">
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
                        <Link href="/dashboard/posts">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                返回文章列表
                            </Button>
                        </Link>
                    </div>
                </header>
                {/* 内容区域 */}
                <div className="container mx-auto px-2 md:px-4 space-y-4 scrollbar-none">
                    {/* 操作区域 */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-xl md:text-2xl font-bold text-primary">
                            {"编辑文章"}
                        </p>
                        {/* 操作按钮 */}
                        <form.Subscribe
                            selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting,
                            ]}
                            children={([canSubmit, isSubmitting]) => (
                                <div className="inline-flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        type="submit"
                                        disabled={!canSubmit}
                                        onClick={() => setSubmitStatus("draft")}
                                    >
                                        {isSubmitting &&
                                        submitStatus === "draft"
                                            ? "..."
                                            : "更新草稿"}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={!canSubmit}
                                        onClick={() =>
                                            setSubmitStatus("published")
                                        }
                                    >
                                        {isSubmitting &&
                                        submitStatus === "published"
                                            ? "..."
                                            : "更新发布"}
                                    </Button>
                                </div>
                            )}
                        />
                    </div>
                    {/* 文章元数据区域 */}
                    <div className="border-2 border-border rounded-md space-y-4 pb-4">
                        <div className="text-lg font-bold py-2 px-4 border-b-2 border-border">
                            {"元数据"}
                        </div>
                        {/* 文章标题和Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form.Field
                                name="title"
                                children={(field) => (
                                    <>
                                        <FloatingLabelInput
                                            variant="material"
                                            label="文章标题"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            error={field.state.meta.errors
                                                .map((e: any) => e.message)
                                                .join(", ")}
                                            className="px-4"
                                        />
                                    </>
                                )}
                            />
                            <form.Field
                                name="slug"
                                children={(field) => (
                                    <>
                                        <FloatingLabelInput
                                            variant="material"
                                            label="文章 slug"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            error={field.state.meta.errors
                                                .map((e: any) => e.message)
                                                .join(", ")}
                                            className="px-4"
                                        />
                                    </>
                                )}
                            />
                        </div>
                        {/* 文章封面 */}
                        <div className="flex flex-col gap-2 px-4">
                            <form.Field
                                name="cover_image_url"
                                children={(field) => (
                                    <div className="flex items-center justify-between gap-2">
                                        <FloatingLabelInput
                                            variant="material"
                                            label="封面图片链接"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value ?? ""}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            error={field.state.meta.errors
                                                .map((e: any) => e.message)
                                                .join(", ")}
                                            className="flex-1"
                                        />

                                        <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border cursor-pointer">
                                            <UploadIcon className="w-4 h-4 mr-2" />
                                            上传
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (!file) return;
                                                    try {
                                                        const res =
                                                            await klogSdk.media.uploadFile(
                                                                file
                                                            );
                                                        field.handleChange(
                                                            res.url
                                                        );
                                                    } catch (e) {
                                                        console.warn(e);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                )}
                            />
                        </div>
                        {/* 文章摘要 */}
                        <div className="flex flex-col gap-2 px-4">
                            <form.Field
                                name="excerpt"
                                children={(field) => (
                                    <>
                                        <label htmlFor={field.name}>
                                            文章摘要
                                        </label>
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value ?? ""}
                                            placeholder="输入文章摘要"
                                            rows={3}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className={cn(
                                                "p-2 border-2 border-border outline-none transition-colors duration-200 ease-in-out",
                                                "focus:border-primary active:border-primary",
                                                field.state.meta.isTouched &&
                                                    !field.state.meta.isValid &&
                                                    "border-red-500"
                                            )}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        {/* 文章分类 */}
                        <div className="flex flex-col gap-2 px-4">
                            <form.Field
                                name="category_id"
                                children={(field) => (
                                    <>
                                        <label htmlFor={field.name}>分类</label>
                                        <Select
                                            options={[
                                                { label: "未分类", value: 0 },
                                                ...(allCategories?.map(
                                                    (c: Category) => ({
                                                        label: c.name,
                                                        value: c.id,
                                                    })
                                                ) || []),
                                            ]}
                                            value={field.state.value ?? 0}
                                            onValueChange={(value) =>
                                                field.handleChange(
                                                    Number(value)
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        {/* 文章标签 */}
                        <div className="flex flex-col gap-2 px-4">
                            <form.Field
                                name="tags"
                                children={(field) => (
                                    <>
                                        <FloatingLabelInput
                                            label="标签（逗号分隔）"
                                            variant="outline"
                                            id={field.name}
                                            name={field.name}
                                            value={(
                                                field.state.value || []
                                            ).join(",")}
                                            placeholder="如：前端,React,TypeScript"
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                        .replace(/，/g, ",")
                                                        .split(",")
                                                        .map((s) => s.trim())
                                                        .filter(Boolean)
                                                )
                                            }
                                        />
                                        {allTags && allTags.length > 0 ? (
                                            <div className="text-xs text-muted-foreground">
                                                已有：
                                                {allTags
                                                    .map((t: Tag) => t.slug)
                                                    .join("，")}
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            />
                        </div>

                        {submitError ? (
                            <div className="text-red-500 text-sm">
                                {submitError}
                            </div>
                        ) : null}
                    </div>
                    {/* 内容编辑区域 */}
                    <div className="border-2 border-border rounded-md space-y-4">
                        <div className="text-lg font-bold py-2 px-4 border-b-2 border-border">
                            {"内容编辑"}
                        </div>
                        <form.Field
                            name="content"
                            children={(field) => (
                                <MarkdownEditorWrapper
                                    value={field.state.value}
                                    // delayValue={post?.content}
                                    onChange={(v) => field.handleChange(v)}
                                    onImageUpload={async (file) => {
                                        const res =
                                            await klogSdk.media.uploadFile(
                                                file
                                            );
                                        return res.url;
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
