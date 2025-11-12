"use client";

// 文章管理列表表格
import type { Post } from "klog-sdk";
import Link from "next/link";
import {
    CalendarIcon,
    PencilIcon,
    TrashIcon,
    MessageCircleMore,
    Settings2,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Edit,
    Trash2,
} from "lucide-react";

import { Badge } from "@/components/mui/badge";
import { cn } from "@/lib/utils";
import { getKLogSDK } from "@/lib/api-request";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/mui/button";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/mui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/mui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/mui/dropdown-menu";
import { useState } from "react";

type ColumnKey =
    | "category"
    | "tags"
    | "views"
    | "comments"
    | "createdAt"
    | "updatedAt";

interface ColumnConfig {
    key: ColumnKey;
    label: string;
    defaultVisible: boolean;
}

const columns: ColumnConfig[] = [
    { key: "category", label: "分类", defaultVisible: true },
    { key: "tags", label: "标签", defaultVisible: true },
    { key: "views", label: "浏览", defaultVisible: true },
    { key: "comments", label: "评论", defaultVisible: true },
    { key: "createdAt", label: "创建时间", defaultVisible: false },
    { key: "updatedAt", label: "更新时间", defaultVisible: true },
];

interface PostsTableProps {
    posts: Post[];
    className?: string;
}

export default function PostsList({ posts, className }: PostsTableProps) {
    const [visibleColumns, setVisibleColumns] = useState<
        Record<ColumnKey, boolean>
    >(
        columns.reduce(
            (acc, col) => ({ ...acc, [col.key]: col.defaultVisible }),
            {} as Record<ColumnKey, boolean>
        )
    );

    const toggleColumn = (key: ColumnKey) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const klogSdk = getKLogSDK();
    const queryClient = useQueryClient();

    const handleDelete = async (id: number) => {
        try {
            await klogSdk.posts.deletePost(id);
            queryClient.invalidateQueries({ queryKey: ["posts:all"] });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className={className}>
            <CardHeader className="flex items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Settings2 className="h-4 w-4 mr-2" />
                            列显示
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>显示列</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {columns.map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.key}
                                checked={visibleColumns[column.key]}
                                onCheckedChange={() => toggleColumn(column.key)}
                            >
                                {column.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>标题</TableHead>
                            {visibleColumns.category && (
                                <TableHead>分类</TableHead>
                            )}
                            {visibleColumns.tags && <TableHead>标签</TableHead>}
                            <TableHead>状态</TableHead>
                            {visibleColumns.views && (
                                <TableHead className="text-right">
                                    浏览
                                </TableHead>
                            )}
                            {visibleColumns.comments && (
                                <TableHead className="text-right">
                                    评论
                                </TableHead>
                            )}
                            {visibleColumns.createdAt && (
                                <TableHead>创建时间</TableHead>
                            )}
                            {visibleColumns.updatedAt && (
                                <TableHead>更新时间</TableHead>
                            )}
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <Link
                                            href={`/qwq/posts/${post.id}/edit`}
                                            className="font-bold text-foreground hover:text-primary transition-colors"
                                        >
                                            {post.title}
                                        </Link>
                                        <span className="text-xs text-muted-foreground mt-1">
                                            {post.slug}
                                        </span>
                                    </div>
                                </TableCell>
                                {visibleColumns.category && (
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {post.category?.name ?? "未分类"}
                                        </span>
                                    </TableCell>
                                )}
                                {visibleColumns.tags && (
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags
                                                ? post.tags
                                                      .slice(0, 2)
                                                      .map((tag) => (
                                                          <Badge
                                                              key={tag.id}
                                                              variant="secondary"
                                                              className="text-xs"
                                                          >
                                                              {tag.name}
                                                          </Badge>
                                                      ))
                                                : null}
                                            {post.tags?.length &&
                                                post.tags?.length > 2 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        +{post.tags.length - 2}
                                                    </Badge>
                                                )}
                                        </div>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Badge
                                        variant={
                                            post.status === "published"
                                                ? "default"
                                                : post.status === "draft"
                                                ? "secondary"
                                                : "outline"
                                        }
                                    >
                                        {post.status === "published"
                                            ? "已发布"
                                            : post.status === "draft"
                                            ? "草稿"
                                            : "归档"}
                                    </Badge>
                                </TableCell>
                                {visibleColumns.views && (
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                            <Eye className="h-4 w-4" />
                                            <span className="text-sm">
                                                {post.view_count}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}
                                {visibleColumns.comments && (
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="text-sm">
                                                {post.comments?.length ?? 0}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}
                                {visibleColumns.createdAt && (
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {post.created_at}
                                        </span>
                                    </TableCell>
                                )}
                                {visibleColumns.updatedAt && (
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {post.updated_at}
                                        </span>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    编辑
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={`/admin/posts/${post.id}/comments`}
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    评论管理
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() =>
                                                    handleDelete(post.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                删除
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}
