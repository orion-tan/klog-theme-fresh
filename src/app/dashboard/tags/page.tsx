// 标签管理页面

import { Metadata } from "next";
import TagsViewTab from "@/components/dashboard/tabs/TagsViewTab";

export const metadata: Metadata = {
    title: "KLog | 标签管理",
    description: "标签管理页面",
};

export default function TagsPage() {
    return (
        <div className="bg-background text-foreground h-full max-h-screen">
            <TagsViewTab />
        </div>
    );
}
