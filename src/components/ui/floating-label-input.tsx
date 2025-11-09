// 浮动标签设计的input

import React from "react";
import { X, CornerDownRight, Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// 定义input变体样式
const inputVariants = cva(
    "peer w-full border-2 bg-transparent px-4 py-3 text-foreground outline-none transition-colors rounded-md",
    {
        variants: {
            variant: {
                default: "",
                material: "",
                outline: "",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

// 定义label变体样式
const labelVariants = cva(
    "cursor-text transition-all duration-300 ease-in-out pointer-events-none",
    {
        variants: {
            variant: {
                default: cn(
                    "absolute left-4 top-1/2 -translate-y-1/2",
                    "peer-focus:-top-5 peer-focus:left-0",
                    "peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-0"
                ),
                material: cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 px-1 bg-inherit",
                    "peer-focus:top-0 peer-focus:scale-[0.85] peer-focus:bg-inherit",
                    "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.85]"
                ),
                outline: "relative top-0 left-0 mb-2",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

interface FloatingLabelInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
        VariantProps<typeof inputVariants> {
    label: string;
    htmlFor?: string;
    error?: string;
    onClear?: () => void;
    variant?: "default" | "material" | "outline";
}

export const FloatingLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(
    (
        {
            label,
            id,
            error,
            htmlFor,
            onClear,
            className,
            value,
            variant = "default",
            placeholder,
            ...props
        },
        ref
    ) => {
        const inputId = id || htmlFor;
        const isOutline = variant === "outline";
        const isDefault = variant === "default";
        const isMaterial = variant === "material";
        const inputVariant = variant as "default" | "material" | "outline";

        return (
            <div className={cn("w-full bg-background", className)}>
                {/* outline变体：label在外部，不需要特殊容器 */}
                {isOutline && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            labelVariants({ variant: inputVariant }),
                            error ? "text-red-500" : "text-foreground"
                        )}
                    >
                        {label}
                    </label>
                )}

                <div
                    className={cn(
                        "bg-inherit",
                        "relative transition-all duration-300 ease-in-out",
                        isDefault &&
                            "[&:has(input:not(:placeholder-shown))]:mt-10 [&:has(input:focus)]:mt-10",
                        isMaterial || (isOutline && "mt-2")
                    )}
                >
                    <input
                        ref={ref}
                        id={inputId}
                        value={value}
                        className={cn(
                            inputVariants({ variant: inputVariant }),
                            error
                                ? "border-red-500"
                                : "border-border focus:border-primary",
                            value ? "pr-10" : ""
                        )}
                        {...props}
                        placeholder={isOutline ? placeholder : " "}
                    />

                    {/* default和material变体：浮动标签 */}
                    {!isOutline && (
                        <label
                            htmlFor={inputId}
                            className={cn(
                                labelVariants({ variant: inputVariant }),
                                error
                                    ? "text-red-500"
                                    : "text-border/70 peer-focus:text-foreground"
                            )}
                        >
                            {label}
                        </label>
                    )}

                    {/* 状态图标 */}
                    <span
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2",
                            "peer-focus:hidden",
                            error ? "text-red-500" : "text-green-500"
                        )}
                        aria-label="input status"
                    >
                        {error ? <X size={20} /> : <Check size={20} />}
                    </span>
                </div>

                {/* 错误信息 */}
                {error && (
                    <div className="mt-1.5 flex items-center justify-end text-sm text-red-500">
                        <CornerDownRight size={14} className="mr-1" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

FloatingLabelInput.displayName = "FloatingLabelInput";
