// 浮动标签设计的input

import React from "react";
import { X, CornerDownRight, Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// 定义input变体样式
const inputVariants = cva(
    [
        "peer w-full border-2 bg-transparent px-3 py-1 text-foreground outline-none transition-colors rounded-md",
        "file:text-foreground placeholder:text-foreground/80 selection:bg-primary selection:text-primary-fg",
        "h-9 min-w-0 rounded-md text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "border-2 border-border, aria-invalid:border-error, focus:border-primary",
    ],
    {
        variants: {
            variant: {
                floating: "",
                material: "",
            },
        },
        defaultVariants: {
            variant: "material",
        },
    }
);

// 定义label变体样式
const labelVariants = cva(
    "cursor-text transition-all duration-300 ease-in-out pointer-events-none text-sm peer-focus:text-base peer-[:not(:placeholder-shown)]:text-base",
    {
        variants: {
            variant: {
                floating: cn(
                    "absolute left-4 top-1/2 -translate-y-1/2",
                    "peer-focus:-top-5 peer-focus:left-0",
                    "peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-0"
                ),
                material: cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 px-1 bg-inherit",
                    "peer-focus:top-0 peer-focus:bg-inherit",
                    "peer-[:not(:placeholder-shown)]:top-0"
                ),
            },
        },
        defaultVariants: {
            variant: "material",
        },
    }
);

interface FloatingLabelInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
        VariantProps<typeof labelVariants> {
    label: string;
    htmlFor?: string;
    error?: string;
    onClear?: () => void;
    /**
     * @deprecated placeholder不会生效,请使用 label
     */
    placeholder?: string;
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
            variant = "material",
            ...props
        },
        ref
    ) => {
        const inputId = id || htmlFor;
        const isDefault = variant === "material";
        const isFloating = variant === "floating";
        const inputVariant = variant as "floating" | "material";

        return (
            <div
                className={cn(
                    "w-full bg-background text-foreground",
                    className
                )}
            >
                <div
                    className={cn(
                        "bg-inherit",
                        "relative transition-all duration-300 ease-in-out",
                        isFloating &&
                            "[&:has(input:not(:placeholder-shown))]:mt-10 [&:has(input:focus)]:mt-10",
                        isDefault && "mt-2"
                    )}
                >
                    <input
                        ref={ref}
                        id={inputId}
                        value={value}
                        className={cn(
                            inputVariants({ variant: inputVariant }),
                            error && "border-error",
                            value ? "pr-10" : ""
                        )}
                        {...props}
                        placeholder={" "}
                    />

                    {/* default和material变体：浮动标签 */}
                    <label
                        htmlFor={inputId}
                        className={cn(
                            labelVariants({ variant: inputVariant }),
                            error
                                ? "text-error"
                                : "text-foreground/80 peer-focus:text-foreground"
                        )}
                    >
                        {label}
                    </label>

                    {/* 状态图标 */}
                    <span
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2",
                            "peer-focus:hidden",
                            error ? "text-error" : "text-success"
                        )}
                        aria-label="input status"
                    >
                        {error ? <X /> : <Check />}
                    </span>
                </div>

                {/* 错误信息 */}
                {error && (
                    <div className="mt-1 flex items-center justify-end text-sm text-error">
                        <CornerDownRight size={14} className="mr-1" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

FloatingLabelInput.displayName = "FloatingLabelInput";
