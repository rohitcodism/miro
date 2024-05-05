'use client'

import { useHistory, useSelf, useCanUndo, useCanRedo, useMutation } from "@/liveblocks.config";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";
import React, { useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState } from "@/Types/Canvas";
import { CursorPresence } from "./CursorPresence";
import { pointerEventToCanvasPoint } from "@/lib/utils";

interface CanvasProps {
    boardId: string
}


export const Canvas = ({
    boardId
}: CanvasProps) => {

    const [camera, setCamera] = useState<Camera>({x: 0, y: 0});

    const history = useHistory();

    const canUndo = useCanUndo();

    const canRedo = useCanRedo();

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY
        }))
    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e:React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);

        setMyPresence({ cursor: current });
    }, [])

    const[canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.none
    })

    const onPointerLeave = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        setMyPresence({
            cursor: null
        })
    }, [])

    const info = useSelf((me) => me.info);

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
            <Toolbar 
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}
            />
            <svg
                className="
                    h-[100vh]
                    w-[100vw]
                "
                onPointerLeave={onPointerLeave}
                onWheel={onWheel}
                onPointerMove={onPointerMove}
            >
                <g>
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
}