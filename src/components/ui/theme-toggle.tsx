"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect, useMemo } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type props = {
    size?: number;
    className?: string;
    text?: string;
};

export default function ThemeToggle({ className, size = 5, text }: props) {
    const { setTheme, resolvedTheme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const remSize = useMemo(() => `${size / 4}rem`, [size]);

    // 初始化时同步主题状态
    useEffect(() => {
        setIsDarkMode(resolvedTheme === "dark");
    });
    useEffect(() => {
        setMounted(true);
    });

    const changeTheme = async () => {
        const newTheme = isDarkMode ? "light" : "dark";
        if (!document.startViewTransition || !buttonRef.current) {
            setTheme(newTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        }).ready;

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        const y = top + height / 2;
        const x = left + width / 2;

        const right = window.innerWidth - left;
        const bottom = window.innerHeight - top;
        const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRad}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 700,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    };
    if (!mounted) {
        return null;
    }
    return (
        <button
            ref={buttonRef}
            onClick={changeTheme}
            className={cn("flex items-center justify-center", className)}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                fill="currentColor"
                strokeLinecap="round"
                viewBox="0 0 32 32"
                style={{ width: remSize, height: remSize }}
            >
                <clipPath id="skiper-btn-2">
                    <motion.path
                        animate={{
                            y: isDarkMode ? 10 : 0,
                            x: isDarkMode ? -12 : 0,
                        }}
                        transition={{ ease: "easeInOut", duration: 0.35 }}
                        d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
                    />
                </clipPath>
                <g clipPath="url(#skiper-btn-2)">
                    <motion.circle
                        animate={{ r: isDarkMode ? 10 : 8 }}
                        transition={{ ease: "easeInOut", duration: 0.35 }}
                        cx="16"
                        cy="16"
                    />
                    <motion.g
                        animate={{
                            rotate: isDarkMode ? -100 : 0,
                            scale: isDarkMode ? 0.5 : 1,
                            opacity: isDarkMode ? 0 : 1,
                        }}
                        transition={{ ease: "easeInOut", duration: 0.35 }}
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M16 5.5v-4" />
                        <path d="M16 30.5v-4" />
                        <path d="M1.5 16h4" />
                        <path d="M26.5 16h4" />
                        <path d="m23.4 8.6 2.8-2.8" />
                        <path d="m5.7 26.3 2.9-2.9" />
                        <path d="m5.8 5.8 2.8 2.8" />
                        <path d="m23.4 23.4 2.9 2.9" />
                    </motion.g>
                </g>
            </svg>
            {text && <span>{text}</span>}
        </button>
    );
}
