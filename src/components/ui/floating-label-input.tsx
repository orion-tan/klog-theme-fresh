// 浮动标签设计的input

import React from "react";
import { X, CornerDownRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface FloatingLabelInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    htmlFor?: string;
    error?: string;
    onClear?: () => void;
}

export const FloatingLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(({ label, id, error, htmlFor, onClear, className, value, ...props }, ref) => {
    const inputId = id || htmlFor;

    return (
        <div className={cn("w-full", className)}>
            <div className="relative transition-all duration-300 ease-in-out [&:has(input:not(:placeholder-shown))]:mt-10 [&:has(input:focus)]:mt-10">
                <input
                    ref={ref}
                    id={inputId}
                    value={value}
                    placeholder={""}
                    className={cn(
                        "peer w-full border-2 bg-transparent px-4 py-3 text-foreground outline-none transition-colors",
                        error
                            ? "border-red-500"
                            : "border-border focus:border-primary",
                        value ? "pr-10" : ""
                    )}
                    {...props}
                />

                {/* 2. 浮动标签 */}
                <label
                    htmlFor={inputId}
                    className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 cursor-text transition-all duration-300 ease-in-out text-border/70",
                        "pointer-events-none",
                        "peer-focus:-top-5 peer-focus:left-0 peer-focus:text-foreground",
                        "peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-foreground"
                    )}
                >
                    {label}
                </label>

                {/* 3. 状态按钮 */}
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

            {/* 4. 错误信息 */}
            {error && (
                <div className="mt-1.5 flex items-center justify-end text-sm text-red-500">
                    <CornerDownRight size={14} className="mr-1" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
});

FloatingLabelInput.displayName = "FloatingLabelInput";
