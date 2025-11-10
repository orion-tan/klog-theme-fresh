import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
        "border-2 border-border",
        "-translate-y-1 -translate-x-1 shadow-[4px_4px_0_0_var(--shadow)]",
        "active:translate-x-0 active:translate-y-0 active:shadow-none",
    ],
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-fg hover:bg-primary/90",
                destructive: "bg-error text-error-fg hover:bg-error/90",
                outline: "bg-background text-foreground",
                secondary:
                    "bg-secondary text-secondary-fg hover:bg-secondary/80",
                ghost: "translate-x-0 translate-y-0 shadow-none hover:bg-primary hover:text-primary-fg hover:border-primary",
                link: "text-primary underline-offset-4 hover:underline hover:translate-x-0 hover:translate-y-0 hover:shadow-none",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
