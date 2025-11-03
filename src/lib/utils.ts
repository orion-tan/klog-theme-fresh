import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import lodash from "lodash";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isBrowser = typeof window !== "undefined";

export function generateSlug(text: string): string {
    try {
        const preparedText = lodash.deburr(text.trim());
        return slugify(preparedText, {
            replacement: "-",
            remove: /[^w-]+/,
        });
    } catch (error) {
        return "";
    }
}
