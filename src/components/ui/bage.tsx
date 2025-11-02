// Bage

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const bageVariants = cva("text-primary px-2 py-1 rounded-sm", {
    variants: {
        variant: {
            primary: "bg-primary",
            secondary: "bg-secondary",
            success: "bg-green-500",
            danger: "bg-red-500",
            warning: "bg-yellow-500",
            info: "bg-blue-500",
        },
    },
    defaultVariants: {
        variant: "primary",
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
