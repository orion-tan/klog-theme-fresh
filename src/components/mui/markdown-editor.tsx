// milkdown markdown 编辑器

"use client";

import { useCallback, useEffect } from "react";
import { Crepe } from "@milkdown/crepe";
import { replaceAll } from "@milkdown/utils";
import { MilkdownProvider, Milkdown, useEditor } from "@milkdown/react";

import "@milkdown/crepe/theme/common/style.css";
import "@/styles/milkdown-theme.css";

interface CrepeEditorProps {
    value: string;
    delayValue?: string;
    readonly?: boolean;
    className?: string;
    onChange?: (value: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

export const CrepeEditor = ({
    value,
    delayValue,
    readonly = false,
    onChange,
    onImageUpload,
    className,
}: CrepeEditorProps) => {
    const { get } = useEditor((root) => {
        const crepe = new Crepe({
            root,
            featureConfigs: {
                [Crepe.Feature.ImageBlock]: {
                    inlineUploadButton: "上传图片",
                    blockUploadButton: "上传图片",
                    blockUploadPlaceholderText: "或者粘贴链接",
                    blockCaptionPlaceholderText: "添加图片描述",
                    onUpload: onImageUpload,
                },
                [Crepe.Feature.Placeholder]: {
                    text: "写点什么呢...",
                    mode: "block",
                },
            },
            defaultValue: value,
        });

        crepe.setReadonly(readonly);

        crepe.on((api) => {
            api.markdownUpdated((_ctx, md, _preMD) => {
                if (onChange) {
                    onChange(md);
                }
            });
        });

        return crepe;
    });

    const editor = get();

    useEffect(() => {
        if (delayValue && editor) {
            editor?.action(replaceAll(delayValue));
        }
    }, [delayValue, editor]);

    return (
        <div className={className}>
            <Milkdown />
        </div>
    );
};

type MarkdownEditorWrapperProps = CrepeEditorProps;

export const MarkdownEditorWrapper = (props: MarkdownEditorWrapperProps) => {
    return (
        <MilkdownProvider>
            <CrepeEditor {...props} />
        </MilkdownProvider>
    );
};
