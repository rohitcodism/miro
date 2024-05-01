'use client'

import { useSelf } from "@/liveblocks.config";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";

interface CanvasProps {
    boardId: string
}


export const Canvas = ({
    boardId
}: CanvasProps) => {

    const info = useSelf((me) => me.info);

    console.log("User info : ", info);

    return(
        <main
            className="
                h-full
                w-full
                relative
                bg-neutral-100
                touch-none
            "
        >
            <Info boardId={boardId}/>
            <Participants />
            <Toolbar />
        </main>
    );
}