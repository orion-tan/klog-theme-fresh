import * as React from "react";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, Ellipsis } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "hover:text-primary inline-flex items-center justify-center border-2 border-border",
    {
        variants: {
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
);

type ButtonProps = VariantProps<typeof buttonVariants>;

type NumberedPaginationProps = {
    currentPage: number;
    totalPages: number;
    paginationItemsToDisplay?: number;
    onPageChange: (page: number) => void;
    className?: string;
};

function NumberedPagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay = 5,
    onPageChange,
    className,
}: NumberedPaginationProps) {
    const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
        currentPage,
        totalPages,
        paginationItemsToDisplay,
    });

    const handlePageChange = (page: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        onPageChange(page);
    };

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        href="#"
                        onClick={handlePageChange(currentPage - 1)}
                        aria-disabled={currentPage === 1}
                    />
                </PaginationItem>

                {showLeftEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            onClick={handlePageChange(page)}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {showRightEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext
                        className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        href="#"
                        onClick={handlePageChange(currentPage + 1)}
                        aria-disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    isActive?: boolean;
    isDisabled?: boolean;
} & Pick<ButtonProps, "size"> &
    React.ComponentProps<"a">;

const PaginationLink = ({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({ size }),
            isActive ? "text-primary font-bold" : "text-secondary",
            className
        )}
        {...props}
    />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeftIcon size={16} strokeWidth={2} />
        <span>上去</span>
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>下来</span>
        <ChevronRightIcon size={16} strokeWidth={2} />
    </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn(
            "flex h-9 w-9 items-center justify-center text-secondary",
            className
        )}
        {...props}
    >
        <Ellipsis size={16} strokeWidth={2} />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
    NumberedPagination,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
