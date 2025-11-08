// 通用下拉选择器组件

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
    label?: string;
    value?: string | number;
    options: SelectOption[];
    onValueChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
}

export function Select({
    label,
    value,
    options,
    onValueChange,
    placeholder = "请选择",
    className,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 获取选中项的显示文本
    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption?.label || placeholder;

    // 点击外部关闭下拉框
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string | number) => {
        onValueChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* 标签 */}
            {label && <label className="block font-medium mb-2">{label}</label>}

            {/* 选择框 */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full px-4 py-2 border-2 border-border bg-background-1 text-foreground",
                    "flex items-center justify-between gap-2",
                    "transition-all duration-200",
                    "-translate-y-0.5 -translate-x-0.5 shadow-[2px_2px_0_0_var(--border)]",
                    "md:hover:-translate-y-1 md:shadow-none md:hover:translate-x-1 md:hover:shadow-[-4px_4px_0_0_var(--border)]",
                    "active:translate-x-0 active:translate-y-0 active:shadow-none",
                    !selectedOption && "text-secondary"
                )}
            >
                <span className="truncate">{displayText}</span>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* 下拉选项 */}
            {isOpen && (
                <div
                    className={cn(
                        "absolute z-50 w-full",
                        "border-2 border-border bg-background-1",
                        "max-h-60 overflow-y-auto scrollbar-thin"
                    )}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelect(option.value)}
                            className={cn(
                                "w-full px-4 py-2 text-left",
                                "hover:bg-primary transition-colors",
                                "border-b border-border last:border-b-0",
                                option.value === value &&
                                    "bg-primary text-background-1 font-bold"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
