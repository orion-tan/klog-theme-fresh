// 文章管理列表表格
import type { Post } from "klog-sdk";
import Bage from "@/components/ui/bage";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PostsTableProps {
    posts: Post[];
    className?: string;
}

export default function PostsTable({ posts, className }: PostsTableProps) {
    return (
        // 表格宽度自适应，超出添加滚动条
        <table className={cn("w-full overflow-x-auto", className)}>
            <thead>
                <tr>
                    <th>标题</th>
                    <th>分类</th>
                    <th>标签</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>更新时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post) => (
                    <tr key={post.id}>
                        <td>
                            <span className="font-bold text-clip">
                                {post.title}
                            </span>
                        </td>
                        <td>
                            <span className="text-clip">
                                {post.category?.name || "未分类"}
                            </span>
                        </td>
                        <td>
                            {/* 最多显示三个标签，更多用 +x 表示 */}
                            <div className="inline-flex items-center gap-2">
                                {post.tags?.slice(0, 3).map((tag) => (
                                    <Link
                                        href={`/dashboard/tags/${tag.id}`}
                                        key={tag.id}
                                    >
                                        <Bage
                                            key={tag.id}
                                            label={tag.name}
                                            variant="primary"
                                        />
                                    </Link>
                                ))}
                                {post.tags?.length && post.tags.length > 3 && (
                                    <Link
                                        href={`/dashboard/tags`}
                                        key={`more-${post.id}`}
                                    >
                                        <Bage
                                            label={`+${post.tags.length - 3}`}
                                            variant="primary"
                                        />
                                    </Link>
                                )}
                            </div>
                        </td>
                        <td>
                            <Bage
                                label={
                                    post.status === "published"
                                        ? "已发布"
                                        : "草稿"
                                }
                                variant={
                                    post.status === "published"
                                        ? "success"
                                        : "warning"
                                }
                            />
                        </td>
                        <td>
                            <span className="text-clip">{post.created_at}</span>
                        </td>
                        <td>
                            <span className="text-clip">{post.updated_at}</span>
                        </td>
                        {/* 操作 */}
                        <td>
                            <div className="inline-flex items-center gap-2">
                                <Link
                                    href={`/dashboard/posts/${post.id}`}
                                    key={`edit-${post.id}`}
                                >
                                    <button className="inline-flex items-center justify-center bg-primary px-4 py-2 rounded-sm">
                                        编辑
                                    </button>
                                </Link>

                                <button className="inline-flex items-center justify-center bg-red-500 px-4 py-2 rounded-sm">
                                    删除
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
