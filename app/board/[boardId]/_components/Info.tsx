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
import { FormEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Actions } from "@/components/Actions";
import { Menu } from "lucide-react";
import { useRenameModal } from "@/store/useRenameModal";

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

    const { onOpen } = useRenameModal();

    const editTitle = useMutation(api.board.editTitle)

    const boardData = useQuery(api.board.get, { boardId: boardId as Id<"boards"> }) //TODO: Learn about useQuery

    if (!boardData) return <InfoSkeleton />;

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
                label="Go to boards"
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
            <Hint
                label="Edit title"
                side="bottom"
                sideOffset={10}
            >
                <Button
                    onClick={() => onOpen(boardData._id, boardData.title)}
                    variant={'board'}
                    className="
                                text-base
                                font-semibold
                                mx-2
                                truncate
                            "
                >
                    {boardData.title}
                </Button>
            </Hint>
            <TextSeparator />
            <Actions
                id={boardData._id}
                title={boardData.title}
                side="bottom"
                sideOffset={10}
            >
                <div>
                    <Hint
                        label="Menu"
                        side="bottom"
                        sideOffset={10}
                    >
                        <Button
                            size={'icon'}
                            variant={'board'}
                        >
                            <Menu />
                        </Button>
                    </Hint>
                </div>
            </Actions>
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
