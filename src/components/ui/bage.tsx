// Bage

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const bageVariants = cva("p-1 border-2 border-border text-sm rounded-sm", {
    variants: {
        variant: {
            primary: "bg-primary",
            secondary: "bg-secondary",
            outline: "bg-transparent",
            success: "border-success text-success",
            danger: "border-error text-error",
            warning: "border-warning text-warning",
        },
    },
    defaultVariants: {
        variant: "outline",
    },
});

type BageProps = VariantProps<typeof bageVariants> & {
    className?: string;
    label: string;
};

export default function Bage({
    label,
    className,
    variant = "primary",
}: BageProps) {
    return (
        <div className={cn(bageVariants({ variant }), className)}>{label}</div>
    );
}
