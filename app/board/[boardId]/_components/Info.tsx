'use client'

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { miroIcon } from "@/assets";
import Link from "next/link";
import Hint from "@/components/Hint";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface InfoProps {
    boardId: string,
}

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
})

export const TextSeparator = () => {
    return (
        <div className="text-neutral-300 px-1.5">
            |
        </div>
    );
}

export const Info = ({
    boardId
}: InfoProps) => {

    const editTitle = useMutation(api.board.editTitle)

    const boardData = useQuery(api.board.get, { boardId: boardId as Id<"boards"> }) //TODO: Learn about useQuery

    const [formData, setFormData] = useState({ title: "" });

    if (!boardData) return <InfoSkeleton />;


    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newTitle = formData.title;

        try {
            editTitle({ id: boardData._id as Id<'boards'>, title: formData.title })

                .then(() => toast({
                    title: "Renamed!",
                    description: `${boardData.title} board renamed to ${newTitle} board`
                }))
                .catch(() => toast({
                    title: "Error!",
                    description: `Something went wrong while renaming the ${boardData.title} board`,
                    variant: 'destructive'
                }))

        } catch (error) {
            toast({
                title: "Error!",
                description: `Something went wrong while renaming the ${boardData.title} board`,
                variant: 'destructive'
            })
        }

        formData.title = "";
    };

    return (
        <div
            className="
                absolute
                top-2
                left-2
                bg-white
                rounded-md
                px-1.5
                h-12
                flex
                items-center
                shadow-md
            "
        >
            <Hint
                label="Back to Home"
                side="bottom"
                sideOffset={15}
            >
                <Link
                    href={'/'}
                >
                    <Button
                        variant={'board'}
                        className="
                    px-2
                "
                    >
                        <Image
                            src={miroIcon}
                            alt="miro-icon"
                            height={30}
                            width={30}
                        />
                        <span
                            className={
                                cn(
                                    "font-semibold text-xl ml-2 text-black",
                                    font.className
                                )
                            }
                        >
                            Miro
                        </span>
                    </Button>
                </Link>
            </Hint>
            <TextSeparator />
            <Dialog>
                <DialogTrigger>
                    <Button
                        variant={'board'}
                        className="
                    text-base
                    font-semibold
                    px-2
                "
                    >
                        {boardData.title}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Rename board
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                                <div className="flex flex-col py-2 gap-y-4">
                                    <Label>Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="New board title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                    <DialogClose
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button type="submit">Save Changes</Button>
                                    </DialogClose>
                                </div>
                            </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export const InfoSkeleton = () => {
    return (
        <div
            className="
            absolute
            top-2
            left-2
            bg-white
            rounded-md
            px-1.5
            h-12
            flex
            items-center
            shadow-md
            w-[300px]
            animate-pulse
        "
        />
    );
}
