import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: "bg-background text-foreground border-border border-2 font-heading shadow-[4px_4px_0_0_var(--shadow)] rounded-md text-[13px] flex items-center gap-2.5 p-4 w-[356px] [&:has(button)]:justify-between",
                    description: "font-base",
                    actionButton:
                        "font-base border-2 text-[12px] h-6 px-2 bg-surface text-foreground border-border rounded-md shrink-0",
                    cancelButton:
                        "font-base border-2 text-[12px] h-6 px-2 bg-surface text-foreground border-border rounded-md shrink-0",
                    warning: "bg-warning text-warning-fg",
                    error: "bg-error text-warning-fg",
                    loading:
                        "[&[data-sonner-toast]_[data-icon]]:flex [&[data-sonner-toast]_[data-icon]]:size-4 [&[data-sonner-toast]_[data-icon]]:relative [&[data-sonner-toast]_[data-icon]]:justify-start [&[data-sonner-toast]_[data-icon]]:items-center [&[data-sonner-toast]_[data-icon]]:flex-shrink-0",
                },
            }}
            style={{
                fontFamily: "inherit",
                overflowWrap: "anywhere",
            }}
            {...props}
        />
    );
};

export { Toaster };
