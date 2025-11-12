"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/mui/command";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/mui/select";

interface ComboboxProps {
    options: { value: any; label: string }[];
    onValueChange?: (value: any) => void;
    className?: string;
    searchPlaceholder?: string;
    selectPlaceholder?: string;
    emptyPlaceholder?: string;
    value?: any;
    defaultValue?: any;
}

export function Combobox({
    options,
    onValueChange,
    className,
    searchPlaceholder = "搜索...",
    selectPlaceholder = "请选择...",
    emptyPlaceholder = "未找到结果",
    value: controlledValue,
    defaultValue,
}: ComboboxProps) {
    const [internalValue, setInternalValue] = useState<any>(
        defaultValue ?? null
    );
    const [open, setOpen] = useState(false);

    const value =
        controlledValue !== undefined ? controlledValue : internalValue;
    const setValue = (newValue: any) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    // 获取当前选中项的标签
    const selectedOption = options.find((option) => option.value === value);
    const selectValue = value?.toString() ?? "";

    return (
        <Select
            value={selectValue}
            onValueChange={(newValue) => {
                const option = options.find(
                    (opt) => opt.value?.toString() === newValue
                );
                if (option) {
                    setValue(option.value);
                }
                setOpen(false);
            }}
            open={open}
            onOpenChange={setOpen}
        >
            <SelectTrigger className={cn("w-full justify-between", className)}>
                <SelectValue placeholder={selectPlaceholder}>
                    {selectedOption?.label ?? selectPlaceholder}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="p-0">
                <Command>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const optionValue =
                                    option.value?.toString() ?? "";
                                const isSelected = selectValue === optionValue;
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                            setValue(option.value);
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                "ml-auto size-4",
                                                isSelected
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </SelectContent>
        </Select>
    );
}
