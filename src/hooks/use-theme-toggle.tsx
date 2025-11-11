"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

type ThemeToggleContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const ThemeToggleContext = createContext<ThemeToggleContextType | null>(null);

export function ThemeToggleProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setTheme, resolvedTheme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // 初始化时同步主题状态
    useEffect(() => {
        setIsDarkMode(resolvedTheme === "dark");
    });

    const changeTheme = async () => {
        const newTheme = isDarkMode ? "light" : "dark";
        if (!document.startViewTransition) {
            setTheme(newTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        }).ready;

        if (newTheme === "dark") {
            document.documentElement.animate(
                {
                    clipPath: [
                        "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%)",
                        "polygon(0% 0%, 100% 0%, 100% 0%, 0% 100%, 0% 100%)",
                        "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%)",
                    ],
                },
                {
                    duration: 700,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        } else {
            document.documentElement.animate(
                {
                    clipPath: [
                        "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                        "polygon(100% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 100%)",
                        "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)",
                    ],
                },
                {
                    duration: 700,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        changeTheme();
    };

    return (
        <ThemeToggleContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeToggleContext.Provider>
    );
}

export function useThemeToggle() {
    const context = useContext(ThemeToggleContext);
    if (!context) {
        throw new Error(
            "useThemeToggle must be used within a ThemeTogleProvider"
        );
    }
    return context;
}
