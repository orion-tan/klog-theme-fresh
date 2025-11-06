// Bage

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const bageVariants = cva("p-1 border-2 border-border text-sm", {
    variants: {
        variant: {
            primary: "bg-primary",
            secondary: "bg-secondary",
            outline: "bg-transparent",
            success: "border-green-500 text-green-500",
            danger: "border-red-500 text-red-500",
            warning: "border-yellow-500 text-yellow-500",
            info: "border-blue-500 text-blue-500",
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
