"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

interface Props {
    children: React.ReactNode;
}

export default function ThemeProvider({ children }: Props) {
    return (
        <NextThemeProvider attribute="class" defaultTheme="light">
            {children}
        </NextThemeProvider>
    );
}