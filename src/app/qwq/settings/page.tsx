// 设置页面

import { Metadata } from "next";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";

export const metadata: Metadata = {
    title: "KLog | 设置",
    description: "设置页面",
};

export default function SettingsPage() {
    return (
        <div className="bg-background text-foreground h-full max-h-screen">
            <SettingsTab />
        </div>
    );
}
