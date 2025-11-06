// 文章修改 Tab

"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Menu, UploadIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { MarkdownEditorWrapper } from "@/components/ui/markdown-editor";
import { getKLogSDK } from "@/lib/api-request";
import { Category, KLogError, NetworkError, Tag } from "klog-sdk";
import { cn } from "@/lib/utils";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/dashboard/use-sidebar";

const postsSchema = z.object({
    title: z.string().min(1, "文章标题不能为空"),
    slug: z.string().min(1, "文章 slug 不能为空"),
    cover_image_url: z.string().pipe(z.url("文章封面链接格式错误")).optional(),
    content: z.string().min(1, "文章内容不能为空"),
    excerpt: z.string().min(1, "文章摘要不能为空").optional().or(z.literal("")),
    category_id: z.number().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published", "archived"]),
});

const defaultPostValues: z.infer<typeof postsSchema> = {
    title: "",
    slug: "",
    cover_image_url: undefined,
    content: "",
    excerpt: "",
    category_id: undefined,
    tags: [],
    status: "draft",
};

export default function PostNewTab() {
    const { setSidebarOpen } = useSidebar();
    // 文章内容
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<
        "draft" | "published" | "archived"
    >("draft");

    const queryClient = useQueryClient();
    const klogSdk = getKLogSDK();

    // 获取分类与标签
    const { data: allCategories } = useQuery({
        queryKey: ["categories:all"],
        queryFn: () => klogSdk.categories.getCategories(),
    });
    const { data: allTags } = useQuery({
        queryKey: ["tags:all"],
        queryFn: () => klogSdk.tags.getTags(),
    });

    const form = useForm({
        defaultValues: defaultPostValues,
        validators: {
            onChange: postsSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                setSubmitError(null);
                const payload = {
                    ...value,
                    status: submitStatus,
                };

                await klogSdk.posts.createPost(payload);
                queryClient.invalidateQueries({ queryKey: ["posts:all"] });
            } catch (error) {
                if (error instanceof NetworkError) {
                    setSubmitError(`网络错误：${error.message}`);
                } else if (error instanceof KLogError) {
                    setSubmitError(`提交失败：${error.message}`);
                } else {
                    setSubmitError("提交失败：未知错误");
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
            <div className="flex flex-col gap-4 max-h-screen pb-4">
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
                            新建文章
                        </h1>
                    </div>
                    {/* 操作按钮 */}
                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                        ]}
                        children={([canSubmit, isSubmitting]) => (
                            <div className="inline-flex items-center gap-2">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    onClick={() => setSubmitStatus("draft")}
                                    className="text-foreground px-4 py-2 disabled:opacity-50 border-border border-2"
                                >
                                    {isSubmitting && submitStatus === "draft"
                                        ? "..."
                                        : "更新草稿"}
                                </button>
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    onClick={() => setSubmitStatus("published")}
                                    className="text-primary px-4 py-2 disabled:opacity-50 border-primary border-2"
                                >
                                    {isSubmitting &&
                                    submitStatus === "published"
                                        ? "..."
                                        : "更新发布"}
                                </button>
                            </div>
                        )}
                    />
                </header>
                {/* 内容区域 */}
                <div className="container mx-auto overflow-y-auto space-y-4 scrollbar-none">
                    {/* 文章元数据区域 */}
                    <div className="border-2 border-border rounded-md space-y-4 pb-4">
                        <div className="text-lg font-bold py-2 px-4 border-b-2 border-border">
                            {"元数据"}
                        </div>
                        {/* 文章标题和Slug */}
                        <div className="grid grid-cols-2 gap-4">
                            <form.Field
                                name="title"
                                children={(field) => (
                                    <>
                                        <FloatingLabelInput
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
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value ?? 0}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    Number(e.target.value) === 0
                                                        ? undefined
                                                        : Number(e.target.value)
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            className={cn(
                                                "p-2 border-2 border-border outline-none transition-colors duration-200 ease-in-out",
                                                "focus:border-primary active:border-primary",
                                                field.state.meta.isTouched &&
                                                    !field.state.meta.isValid &&
                                                    "border-red-500"
                                            )}
                                        >
                                            <option value={0}>选择分类</option>
                                            {allCategories?.map(
                                                (c: Category) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
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
                                        <label htmlFor={field.name}>
                                            标签（逗号分隔）
                                        </label>
                                        <input
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
                                            className={cn(
                                                "p-2 border-2 border-border outline-none transition-colors duration-200 ease-in-out",
                                                "focus:border-primary active:border-primary",
                                                field.state.meta.isTouched &&
                                                    !field.state.meta.isValid &&
                                                    "border-red-500"
                                            )}
                                        />
                                        {allTags && allTags.length > 0 ? (
                                            <div className="text-xs text-muted-foreground">
                                                已有：
                                                {allTags
                                                    .map((t: Tag) => t.name)
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
                                    onChange={(v) => field.handleChange(v)}
                                    onImageUpload={async (file) => {
                                        const res =
                                            await klogSdk.media.uploadFile(
                                                file
                                            );
                                        return res.url;
                                    }}
                                    className="p-0"
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
