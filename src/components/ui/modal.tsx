// 通用模态框组件

"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    style,
}: ModalProps) {
    // ESC键关闭
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    // 防止背景滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 背景遮罩 */}
                    <motion.div
                        className="fixed inset-0 bg-border/60 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* 模态框内容 */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            className={cn(
                                "bg-background-1 border-2 border-border p-6 md:p-8",
                                "max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-thin",
                                "shadow-[4px_4px_0_0_var(--border)]",
                                "pointer-events-auto",
                                className
                            )}
                            style={style}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 顶部标题栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-primary">
                                    {title}
                                </h2>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    aria-label="关闭"
                                    size="icon"
                                >
                                    <X size={16} />
                                </Button>
                            </div>

                            {/* 内容区域 */}
                            <div>{children}</div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
