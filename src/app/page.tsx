"use client";

// 主页测试
import React from "react";

import { Button } from "@/components/mui/button";

import { Badge } from "@/components/mui/badge";

import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/mui/card";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/mui/alert-dialog";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/mui/dialog";
import { Checkbox } from "@/components/mui/checkbox";

import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/mui/context-menu";

import { Input } from "@/components/mui/input";
import { FloatingLabelInput } from "@/components/mui/floating-label-input";

import { ScrollArea } from "@/components/mui/scroll-area";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/mui/select";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/mui/pagination";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
    SheetClose,
    SheetFooter,
} from "@/components/mui/sheet";

import { toast } from "sonner";
import { Toaster } from "@/components/mui/sonner";

import {
    Table,
    TableCaption,
    TableHeader,
    TableBody,
    TableFooter,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/mui/table";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/mui/tooltip";

import { Textarea } from "@/components/mui/textarea";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/mui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/mui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
];

export default function HomePage() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    return (
        <ScrollArea className="h-screen">
            <div className="w-full min-h-screen p-4 flex flex-col gap-8 items-center mt-8">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value
                                ? frameworks.find(
                                      (framework) => framework.value === value
                                  )?.label
                                : "Select framework..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput
                                placeholder="Search framework..."
                                className="h-9"
                            />
                            <CommandList>
                                <CommandEmpty>No framework found.</CommandEmpty>
                                <CommandGroup>
                                    {frameworks.map((framework) => (
                                        <CommandItem
                                            key={framework.value}
                                            value={framework.value}
                                            onSelect={(currentValue) => {
                                                setValue(
                                                    currentValue === value
                                                        ? ""
                                                        : currentValue
                                                );
                                                setOpen(false);
                                            }}
                                        >
                                            {framework.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === framework.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <div className="flex gap-4">
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="default">Default Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="link">Link Button</Button>
                </div>

                <div className="flex gap-2">
                    <Badge>Badge</Badge>
                    <Badge variant="outline">Badge</Badge>
                    <Badge variant="secondary">Badge</Badge>
                    <Badge variant="destructive">Badge</Badge>
                </div>

                <div className="w-[500px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex gap-8 items-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">弹出确认</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>提示弹窗</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">打开对话框</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Dialog Title</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                这是一个对话框
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>

                    <div>
                        <Checkbox id="checkbox" className="mr-2" />
                        <label htmlFor="checkbox">Checkbox</label>
                    </div>
                </div>

                <ContextMenu>
                    <ContextMenuTrigger className="flex h-[150px] w-[400px] items-center justify-center rounded-md border border-dashed text-sm">
                        Right click here
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-52">
                        <ContextMenuItem inset>
                            Back
                            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset disabled>
                            Forward
                            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset>
                            Reload
                            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuSub>
                            <ContextMenuSubTrigger inset>
                                More Tools
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-44">
                                <ContextMenuItem>Save Page...</ContextMenuItem>
                                <ContextMenuItem>
                                    Create Shortcut...
                                </ContextMenuItem>
                                <ContextMenuItem>
                                    Name Window...
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem>
                                    Developer Tools
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem variant="destructive">
                                    Delete
                                </ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                        <ContextMenuSeparator />
                        <ContextMenuCheckboxItem checked>
                            Show Bookmarks
                        </ContextMenuCheckboxItem>
                        <ContextMenuCheckboxItem>
                            Show Full URLs
                        </ContextMenuCheckboxItem>
                        <ContextMenuSeparator />
                        <ContextMenuRadioGroup value="pedro">
                            <ContextMenuLabel inset>People</ContextMenuLabel>
                            <ContextMenuRadioItem value="pedro">
                                Pedro Duarte
                            </ContextMenuRadioItem>
                            <ContextMenuRadioItem value="colm">
                                Colm Tuite
                            </ContextMenuRadioItem>
                        </ContextMenuRadioGroup>
                    </ContextMenuContent>
                </ContextMenu>

                <Input placeholder="输入测试" className="w-[400px]" />
                <FloatingLabelInput
                    label="输入测试"
                    error="错误信息你捶捶哦"
                    className="w-[400px]"
                />

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>

                <ScrollArea className="rounded-md h-[200px] w-[350px] text-primary-fg border-2 border-border bg-primary p-4 shadow-[4px_4px_0_0_var(--shadow)]">
                    Jokester began sneaking into the castle in the middle of the
                    night and leaving jokes all over the place: under the
                    king&apos;s pillow, in his soup, even in the royal toilet.
                    The king was furious, but he couldn&apos;t seem to stop
                    Jokester. And then, one day, the people of the kingdom
                    discovered that the jokes left by Jokester were so funny
                    that they couldn&apos;t help but laugh. And once they
                    started laughing, they couldn&apos;t stop.
                </ScrollArea>

                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">打开右侧 Sheet </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Edit profile</SheetTitle>
                            <SheetDescription>
                                Make changes to your profile here. Click save
                                when you&apos;re done.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <label htmlFor="sheet-demo-name">Name</label>
                                <Input
                                    id="sheet-demo-name"
                                    defaultValue="Pedro Duarte"
                                />
                            </div>
                            <div className="grid gap-3">
                                <label htmlFor="sheet-demo-username">
                                    Username
                                </label>
                                <Input
                                    id="sheet-demo-username"
                                    defaultValue="@peduarte"
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="submit">Save changes</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={() => toast("Event has been created")}
                    >
                        Default
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => toast.success("Event has been created")}
                    >
                        Success
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            toast.info(
                                "Be at the area 10 minutes before the event time"
                            )
                        }
                    >
                        Info
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            toast.warning(
                                "Event start time cannot be earlier than 8am"
                            )
                        }
                    >
                        Warning
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            toast.error("Event has not been created")
                        }
                    >
                        Error
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            toast.promise<{ name: string }>(
                                () =>
                                    new Promise((resolve) =>
                                        setTimeout(
                                            () => resolve({ name: "Event" }),
                                            2000
                                        )
                                    ),
                                {
                                    loading: "Loading...",
                                    success: (data) =>
                                        `${data.name} has been created`,
                                    error: "Error",
                                }
                            );
                        }}
                    >
                        Promise
                    </Button>
                    <Toaster />
                </div>

                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">
                                    {invoice.invoice}
                                </TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">
                                    {invoice.totalAmount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">
                                $2,500.00
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost">Hover</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add to library</p>
                    </TooltipContent>
                </Tooltip>

                <Textarea
                    placeholder="Type your message here."
                    className="w-[500px] max-h-[300px]"
                />
            </div>
        </ScrollArea>
    );
}
