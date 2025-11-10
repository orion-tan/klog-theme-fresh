import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    [
        "border-2 border-border",
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none aria-invalid:border-border/50 transition-[color,box-shadow] overflow-hidden",
    ],
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-fg [a&]:hover:bg-primary/90",
                secondary:
                    "bg-secondary text-secondary-fg [a&]:hover:bg-secondary/90",
                destructive: "bg-error text-error-fg [a&]:hover:bg-error/90",
                outline:
                    "text-foreground [a&]:hover:bg-surface [a&]:hover:text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
