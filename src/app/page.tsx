// 主页测试

import { MarkdownEditorWrapper } from "@/components/ui/markdown-editor";

export default function HomePage() {
    return (
        <div className="w-full min-h-screen">
            <MarkdownEditorWrapper
                value="# Hello\n\nThis is a test"
                className="m-8 [&_.milkdown]:rounded-2xl"
            />
        </div>
    );
}
