import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center whitespace-nowrap rounded-none",
        "font-medium transition-all duration-200 border-2 border-border",
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 disabled:text-border disabled:cursor-not-allowed",
        "-translate-y-0.5 -translate-x-0.5 shadow-[2px_2px_0_0_var(--border)]",
        "md:translate-x-0 md:translate-y-0 md:shadow-none",
        "md:hover:-translate-y-1 md:hover:translate-x-1 md:hover:shadow-[-4px_4px_0_0_var(--border)]",
        "active:translate-x-0 active:translate-y-0 active:shadow-none",
        "md:active:translate-x-0 md:active:translate-y-0 md:active:shadow-none",
    ],
    {
        variants: {
            variant: {
                default: "bg-primary text-foreground",
                outline: "bg-transparent text-foreground border-border",
                primary: "bg-primary text-foreground",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 px-3 py-1.5",
                lg: "h-12 px-6 py-3",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends VariantProps<typeof buttonVariants>,
        React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, className }),
                    "disabled:opacity-50"
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
