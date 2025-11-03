// 文章修改 Tab

"use client";

import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { MarkdownEditorWrapper } from "@/components/ui/markdown-editor";
import { getKLogSDK } from "@/lib/api-request";
import { KLogError, NetworkError, type Post } from "klog-sdk";
import { cn } from "@/lib/utils";

const postsSchema = z.object({
    title: z.string().min(1, "文章标题不能为空"),
    slug: z.string().min(1, "文章 slug 不能为空"),
    cover_image_url: z
        .string()
        .url("文章封面链接格式错误")
        .optional()
        .or(z.literal(""))
        .transform((v) => (v === "" ? undefined : v)),
    content: z.string().min(1, "文章内容不能为空"),
    excerpt: z.string().min(1, "文章摘要不能为空").optional().or(z.literal("")),
    category_id: z.number().min(1, "文章分类不能为空"),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published", "archived"]),
});

const defaultPostValues: z.infer<typeof postsSchema> = {
    title: "",
    slug: "",
    cover_image_url: undefined,
    content: "",
    excerpt: "",
    category_id: 0,
    tags: [],
    status: "draft",
};

interface PostEditTabProps {
    postId?: string;
    mode: "edit" | "new";
}

export default function PostEditTab({ postId, mode }: PostEditTabProps) {
    // 文章内容
    const [articleContent, setArticleContent] = useState<string>("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<
        "draft" | "published" | "archived"
    >("draft");
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

    const isEditMode = mode === "edit" && !!postId;
    const router = useRouter();
    const queryClient = useQueryClient();

    // 获取分类与标签
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getKLogSDK().categories.getCategories(),
    });
    const { data: tags } = useQuery({
        queryKey: ["tags"],
        queryFn: () => getKLogSDK().tags.getTags(),
    });

    // 获取文章详情（编辑模式）
    const {
        data: postDetail,
        isLoading: postLoading,
        error: postError,
    } = useQuery({
        enabled: isEditMode,
        queryKey: ["post", postId],
        queryFn: () => getKLogSDK().posts.getPost(Number(postId)),
    });

    const initialValues = useMemo(() => {
        if (isEditMode && postDetail) {
            const p = postDetail as Post;
            return {
                title: p.title ?? "",
                slug: p.slug ?? "",
                cover_image_url: p.cover_image_url ?? undefined,
                content: p.content ?? "",
                excerpt: p.excerpt ?? "",
                category_id: (p.category_id as unknown as number) ?? 0,
                tags:
                    (Array.isArray(p.tags)
                        ? p.tags.map((t: any) =>
                              typeof t === "string" ? t : t.name || t
                          )
                        : []) ?? [],
                status:
                    (p.status as "draft" | "published" | "archived") ?? "draft",
            } as z.infer<typeof postsSchema>;
        }
        return {
            ...defaultPostValues,
        };
    }, [isEditMode, postDetail]);

    const form = useForm({
        defaultValues: initialValues,
        onSubmit: async ({ value }) => {
            try {
                setSubmitError(null);
                const finalContent =
                    articleContent ||
                    (isEditMode && postDetail
                        ? (postDetail as Post).content ?? ""
                        : value.content);
                const payload = {
                    ...value,
                    content: finalContent,
                    status: submitStatus,
                };
                if (isEditMode && postId) {
                    await getKLogSDK().posts.updatePost(
                        Number(postId),
                        payload
                    );
                    // 使缓存失效并刷新
                    queryClient.invalidateQueries({
                        queryKey: ["post", postId],
                    });
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                } else {
                    await getKLogSDK().posts.createPost(payload);
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                }
                setSubmitSuccess(true);
                // 延迟跳转，给用户看到成功提示
                setTimeout(() => {
                    router.push("/dashboard/posts");
                }, 1500);
            } catch (error) {
                if (error instanceof NetworkError) {
                    setSubmitError(`提交失败：${error.message}`);
                } else if (error instanceof KLogError) {
                    setSubmitError(`提交失败：${error.message}`);
                } else {
                    setSubmitError("提交失败：未知错误");
                }
            }
        },
    });

    // 当数据加载完成后，重置表单值
    useEffect(() => {
        if (isEditMode && postDetail && form) {
            const p = postDetail as Post;
            const values = {
                title: p.title ?? "",
                slug: p.slug ?? "",
                cover_image_url: p.cover_image_url ?? undefined,
                content: p.content ?? "",
                excerpt: p.excerpt ?? "",
                category_id: (p.category_id as unknown as number) ?? 0,
                tags:
                    (Array.isArray(p.tags)
                        ? p.tags.map((t: any) =>
                              typeof t === "string" ? t : t.name || t
                          )
                        : []) ?? [],
                status:
                    (p.status as "draft" | "published" | "archived") ?? "draft",
            };
            form.reset(values);
            setArticleContent(p.content ?? "");
            setSubmitStatus(
                (p.status as "draft" | "published" | "archived") ?? "draft"
            );
        }
    });

    // 同步编辑模式下内容到编辑器
    const contentValue =
        isEditMode && postDetail
            ? articleContent || ((postDetail as Post).content ?? "")
            : articleContent;

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

    if (isEditMode && postLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span>加载文章中...</span>
            </div>
        );
    }

    if (isEditMode && postError) {
        const err = postError as Error;
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-red-500">加载失败：{err.message}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 md:gap-8 h-full md:flex-row-reverse p-4 md:p-8">
            <div className="md:hidden mb-4 md:mb-8">
                <h1 className="text-2xl font-bold text-primary">
                    {isEditMode ? "编辑文章" : "新建文章"}
                </h1>
            </div>
            {/* 文章元数据区域（右侧/移动端居上） */}
            <div className="max-w-md w-full md:h-full space-y-4 md:sticky md:top-6 self-start">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    {/* 文章标题 */}
                    <div className="flex flex-col gap-2">
                        <form.Field
                            name="title"
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value || value.trim().length === 0) {
                                        return "文章标题不能为空";
                                    }
                                    return undefined;
                                },
                            }}
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
                                                "p-2 rounded-sm flex-1 bg-background border",
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
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value || value.trim().length === 0) {
                                        return "文章 slug 不能为空";
                                    }
                                    if (!/^[a-z0-9-]+$/.test(value)) {
                                        return "slug 只能包含小写字母、数字和连字符";
                                    }
                                    return undefined;
                                },
                            }}
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
                                                "p-2 rounded-sm flex-1 bg-background border",
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
                            validators={{
                                onChange: ({ value }) => {
                                    if (value && value.trim() !== "") {
                                        try {
                                            new URL(value);
                                        } catch {
                                            return "文章封面链接格式错误";
                                        }
                                    }
                                    return undefined;
                                },
                            }}
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
                                                    "p-2 rounded-sm flex-1 bg-background border",
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
                                        className="p-2 rounded-sm flex-1 bg-background"
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
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value || value <= 0) {
                                        return "文章分类不能为空";
                                    }
                                    return undefined;
                                },
                            }}
                            children={(field) => (
                                <>
                                    <label htmlFor={field.name}>分类</label>
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) =>
                                            field.handleChange(
                                                Number(e.target.value)
                                            )
                                        }
                                        onBlur={field.handleBlur}
                                        className={cn(
                                            "p-2 rounded-sm bg-background border",
                                            field.state.meta.isTouched &&
                                                !field.state.meta.isValid &&
                                                "border-red-500"
                                        )}
                                    >
                                        <option value={0}>选择分类</option>
                                        {categories?.map((c) => (
                                            <option
                                                key={c.id}
                                                value={c.id as any}
                                            >
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
                                                    .split(",")
                                                    .map((s) => s.trim())
                                                    .filter(Boolean)
                                            )
                                        }
                                        className="p-2 rounded-sm flex-1 bg-background"
                                    />
                                    {tags && tags.length > 0 ? (
                                        <div className="text-xs text-muted-foreground">
                                            已有：
                                            {tags.map((t) => t.name).join("，")}
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
                                        form.handleSubmit();
                                    }}
                                    className="bg-primary/80 text-foreground rounded-sm px-4 py-2 disabled:bg-primary/60"
                                >
                                    {isSubmitting ? "..." : "保存草稿"}
                                </button>
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    onClick={() => {
                                        setSubmitStatus("published");
                                        form.handleSubmit();
                                    }}
                                    className="bg-primary text-foreground rounded-sm px-4 py-2 disabled:bg-primary/60"
                                >
                                    {isSubmitting
                                        ? "..."
                                        : isEditMode
                                        ? "更新"
                                        : "发布"}
                                </button>
                            </div>
                        )}
                    />
                    {submitError ? (
                        <div className="text-red-500 text-sm">
                            {submitError}
                        </div>
                    ) : null}
                    {submitSuccess ? (
                        <div className="text-green-500 text-sm">
                            提交成功，正在跳转...
                        </div>
                    ) : null}
                </form>
            </div>
            {/* 文章内容编辑区域（左侧/移动端居下） */}
            <div className="flex-1 max-w-md md:max-w-none w-full">
                <div className="hidden md:block mb-8">
                    <h1 className="text-2xl font-bold text-primary">
                        {isEditMode ? "编辑文章" : "新建文章"}
                    </h1>
                </div>
                <MarkdownEditorWrapper
                    value={contentValue}
                    onChange={(v) => setArticleContent(v)}
                    onImageUpload={async (file) => {
                        const res = await getKLogSDK().media.uploadFile(file);
                        return res.url;
                    }}
                    className="border-2 border-primary rounded-md"
                />
            </div>
        </div>
    );
}
