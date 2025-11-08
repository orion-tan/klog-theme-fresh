// 分类管理页面

import CategoriesViewTab from "@/components/dashboard/tabs/CategoriesViewTab";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "KLog | 分类管理",
    description: "分类管理页面",
};

export default function CategoriesPage() {
    return (
        <div className="bg-background-1 text-foreground h-full max-h-screen">
            <CategoriesViewTab />
        </div>
    );
}
