// 文章修改 Tab

"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { MarkdownEditorWrapper } from "@/components/ui/markdown-editor";
import { getKLogSDK } from "@/lib/api-request";
import { Category, KLogError, NetworkError, Tag } from "klog-sdk";
import { cn } from "@/lib/utils";

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
    // 文章内容
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<
        "draft" | "published" | "archived"
    >("draft");

    const queryClient = useQueryClient();

    // 获取分类与标签
    const { data: allCategories } = useQuery({
        queryKey: ["categories:all"],
        queryFn: () => getKLogSDK().categories.getCategories(),
    });
    const { data: allTtags } = useQuery({
        queryKey: ["tags:all"],
        queryFn: () => getKLogSDK().tags.getTags(),
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

                await getKLogSDK().posts.createPost(payload);
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

    // 元数据错误提示组件
    function FieldInfo({ field }: { field: any }) {
        const errors = field.state.meta.errors
            .map((e: any) => e.message)
            .join(", ");
        return field.state.meta.isTouched && !field.state.meta.isValid ? (
            <div className="text-sm text-red-500 text-clip" title={errors}>
                {errors}
            </div>
        ) : null;
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <div className="flex flex-col gap-4 md:gap-8 h-full md:flex-row-reverse p-4 md:p-8">
                <div className="md:hidden mb-4 md:mb-8">
                    <h1 className="text-2xl font-bold text-primary">
                        {"新建文章"}
                    </h1>
                </div>
                {/* 文章元数据区域（右侧/移动端居上） */}
                <div className="max-w-md w-full md:h-full space-y-4 md:sticky md:top-6 self-start">
                    {/* 文章标题 */}
                    <div className="flex flex-col gap-2">
                        <form.Field
                            name="title"
                            children={(field) => {
                                return (
                                    <>
                                        <label htmlFor={field.name}>
                                            文章标题
                                        </label>
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            placeholder="输入文章标题"
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            className={cn(
                                                "p-2 rounded-sm flex-1 bg-background border border-transparent",
                                                "focus:border-primary focus:outline-none",
                                                field.state.meta.isTouched &&
                                                    !field.state.meta.isValid &&
                                                    "border-red-500"
                                            )}
                                        />
                                        <FieldInfo field={field} />
                                    </>
                                );
                            }}
                        />
                    </div>
                    {/* 文章 slug */}
                    <div className="flex flex-col gap-2">
                        <form.Field
                            name="slug"
                            children={(field) => {
                                return (
                                    <>
                                        <label htmlFor={field.name}>
                                            文章 slug
                                        </label>
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            placeholder="输入文章 slug"
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            className={cn(
                                                "p-2 rounded-sm flex-1 bg-background border border-transparent",
                                                "focus:border-primary focus:outline-none",
                                                field.state.meta.isTouched &&
                                                    !field.state.meta.isValid &&
                                                    "border-red-500"
                                            )}
                                        />
                                        <FieldInfo field={field} />
                                    </>
                                );
                            }}
                        />
                    </div>
                    {/* 文章封面（链接与上传） */}
                    <div className="flex flex-col gap-2">
                        <form.Field
                            name="cover_image_url"
                            children={(field) => {
                                return (
                                    <>
                                        <label htmlFor={field.name}>
                                            封面图片链接
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value ?? ""}
                                                placeholder="输入或上传生成链接"
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                className={cn(
                                                    "p-2 rounded-sm flex-1 bg-background border border-transparent",
                                                    "focus:border-primary focus:outline-none",
                                                    field.state.meta
                                                        .isTouched &&
                                                        !field.state.meta
                                                            .isValid &&
                                                        "border-red-500"
                                                )}
                                            />
                                            <label className="bg-primary text-foreground px-3 py-2 rounded-sm cursor-pointer hover:bg-primary/90 transition-colors">
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
                                                                await getKLogSDK().media.uploadFile(
                                                                    file
                                                                );
                                                            field.handleChange(
                                                                res.url
                                                            );
                                                        } catch (e) {
                                                            // 忽略，交由总提交错误处理
                                                            console.warn(e);
                                                        } finally {
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {field.state.value && (
                                            <div className="mt-2">
                                                <img
                                                    src={field.state.value}
                                                    alt="封面预览"
                                                    className="max-w-full h-auto max-h-32 rounded-sm border border-primary/20"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).style.display =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <FieldInfo field={field} />
                                    </>
                                );
                            }}
                        />
                    </div>
                    {/* 文章摘要 */}
                    <div className="flex flex-col gap-2">
                        <form.Field
                            name="excerpt"
                            children={(field) => (
                                <>
                                    <label htmlFor={field.name}>文章摘要</label>
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value ?? ""}
                                        placeholder="输入文章摘要"
                                        rows={3}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className={cn(
                                            "p-2 rounded-sm flex-1 bg-background border border-transparent",
                                            "focus:border-primary focus:outline-none",
                                            field.state.meta.isTouched &&
                                                !field.state.meta.isValid &&
                                                "border-red-500"
                                        )}
                                    />
                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                    </div>
                    {/* 文章分类 */}
                    <div className="flex flex-col gap-2">
                        <form.Field
                            name="category_id"
                            children={(field) => (
                                <>
                                    <label htmlFor={field.name}>分类</label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) =>
                                            field.handleChange(
                                                Number(e.target.value) === 0
                                                    ? undefined
                                                    : Number(e.target.value)
                                            )
                                        }
                                        onBlur={field.handleBlur}
                                        className={cn(
                                            "p-2 rounded-sm bg-background border border-transparent",
                                            "focus:border-primary focus:outline-none",
                                            field.state.meta.isTouched &&
                                                !field.state.meta.isValid &&
                                                "border-red-500"
                                        )}
                                    >
                                        <option value={0}>选择分类</option>
                                        {allCategories?.map((c: Category) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                    </div>
                    {/* 文章标签（逗号分隔） */}
                    <div className="flex flex-col gap-2">
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
                                        value={(field.state.value || []).join(
                                            ","
                                        )}
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
                                            "p-2 rounded-sm flex-1 bg-background border border-transparent",
                                            "focus:border-primary focus:outline-none",
                                            field.state.meta.isTouched &&
                                                !field.state.meta.isValid &&
                                                "border-red-500"
                                        )}
                                    />
                                    {allTtags && allTtags.length > 0 ? (
                                        <div className="text-xs text-muted-foreground">
                                            已有：
                                            {allTtags
                                                .map((t: Tag) => t.name)
                                                .join("，")}
                                        </div>
                                    ) : null}
                                </>
                            )}
                        />
                    </div>
                    {/* 操作按钮 */}
                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                        ]}
                        children={([canSubmit, isSubmitting]) => (
                            <div className="flex items-center justify-start gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    onClick={() => {
                                        setSubmitStatus("draft");
                                    }}
                                    className="bg-primary/80 text-foreground rounded-sm px-4 py-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? "..." : "保存草稿"}
                                </button>
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    onClick={() => {
                                        setSubmitStatus("published");
                                    }}
                                    className="bg-primary text-foreground rounded-sm px-4 py-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? "..." : "发布"}
                                </button>
                            </div>
                        )}
                    />
                    {submitError ? (
                        <div className="text-red-500 text-sm">
                            {submitError}
                        </div>
                    ) : null}
                </div>
                {/* 文章内容编辑区域（左侧/移动端居下） */}
                <div className="flex-1 max-w-md md:max-w-none w-full">
                    <div className="hidden md:block mb-8">
                        <h1 className="text-2xl font-bold text-primary">
                            {"新建文章"}
                        </h1>
                    </div>
                    <form.Field
                        name="content"
                        children={(field) => (
                            <MarkdownEditorWrapper
                                value={field.state.value}
                                onChange={(v) => field.handleChange(v)}
                                onImageUpload={async (file) => {
                                    const res =
                                        await getKLogSDK().media.uploadFile(
                                            file
                                        );
                                    return res.url;
                                }}
                                className={cn(
                                    "border-2 border-primary rounded-md [&_.milkdown]:rounded-md",
                                    field.state.meta.isTouched &&
                                        !field.state.meta.isValid &&
                                        "border-red-500"
                                )}
                            />
                        )}
                    />
                </div>
            </div>
        </form>
    );
}
