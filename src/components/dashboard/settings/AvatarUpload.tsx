// 头像上传组件

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";

export interface AvatarUploadProps {
    currentAvatarUrl?: string | null;
    onUpload: (file: File) => Promise<string>;
    className?: string;
}

export function AvatarUpload({
    currentAvatarUrl,
    onUpload,
    className,
}: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 检查文件类型
        if (!file.type.startsWith("image/")) {
            setError("请选择图片文件");
            return;
        }

        // 检查文件大小（限制2MB）
        if (file.size > 2 * 1024 * 1024) {
            setError("图片大小不能超过 2MB");
            return;
        }

        setIsUploading(true);
        setError(null);
        try {
            const url = await onUpload(file);
            setAvatarUrl(url);
        } catch (err) {
            setError((err as Error).message || "上传失败");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={cn("flex flex-col md:flex-row items-center gap-4", className)}>
            {/* 头像预览 */}
            <div className="w-24 h-24 border-2 border-border rounded-full overflow-hidden bg-background">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="头像"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary">
                        <span className="text-4xl">👤</span>
                    </div>
                )}
            </div>

            {/* 上传按钮和提示 */}
            <div className="flex flex-col gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    <UploadIcon className="w-4 h-4 mr-2" />
                    {isUploading ? "上传中..." : "上传新头像"}
                </Button>
                <p className="text-xs text-secondary">
                    支持 JPG、PNG 格式，最大 2MB
                </p>
                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        </div>
    );
}
