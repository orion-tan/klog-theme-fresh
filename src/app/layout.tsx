import type { Metadata } from "next";
import { LXGW_WenKai_Mono_TC } from "next/font/google";

import ThemeProvider from "@/providers/theme-provider";
import { ThemeToggleProvider } from "@/hooks/use-theme-toggle";

import "@/styles/globals.css";

const lxgwWenKaiMonoTC = LXGW_WenKai_Mono_TC({
    weight: ["400", "700"],
    variable: "--font-lxgw-wenkai-mono-tc",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Klog",
    description:
        "Klog is a platform for creating and sharing your thoughts and ideas.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${lxgwWenKaiMonoTC.className} antialiased`}>
                <ThemeProvider>
                    <ThemeToggleProvider>{children}</ThemeToggleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
