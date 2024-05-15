'use client'

import { useHistory, useSelf, useCanUndo, useCanRedo, useMutation, useStorage } from "@/liveblocks.config";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";
import React, { useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point } from "@/Types/Canvas";
import { CursorPresence } from "./CursorPresence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { nanoid } from 'nanoid';
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./LayerPreview";

const MAX_LAYERS = 100;

interface CanvasProps {
    boardId: string
}


export const Canvas = ({
    boardId
}: CanvasProps) => {

    const layerIds = useStorage((root) => root.layerIds);

    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r:0,
        g: 0,
        b: 0
    })

    const [camera, setCamera] = useState<Camera>({x: 0, y: 0}); //TODO: Study about how the camera is working

    const history = useHistory();

    const canUndo = useCanUndo();

    const canRedo = useCanRedo();

    const insertLayer = useMutation((
        {storage, setMyPresence},
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Note | LayerType.Text, 
        position: Point
    ) => {
        const liveLayers = storage.get("layers");

        if(liveLayers.size >= MAX_LAYERS){
            return;
        }

        const layerIds = storage.get('layerIds');

        const layerId = nanoid();

        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor
        })

        console.log("New layer is created : ",layer)

        layerIds.push(layerId);

        liveLayers.set(layerId, layer);

        setMyPresence({ selection: [layerId] }, { addToHistory: true });
        setCanvasState({mode: CanvasMode.none})

    }, [lastUsedColor])

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

    const onPointerUp = useMutation((
            {},
            e
        ) => {

            console.log("On pointer up is fired.")

            const point = pointerEventToCanvasPoint(e, camera);

            console.log("Canvas state is : ", CanvasMode[canvasState.mode])

            console.log("Pointer is up : ",{
                point,
                mode: canvasState.mode === CanvasMode.Inserting ? "Inserting" : "none",
            })

            if(canvasState.mode === CanvasMode.Inserting){
                insertLayer(canvasState.layerType, point);
                console.log("Inserted layer",LayerType[canvasState.layerType]);
                
            } else {
                setCanvasState({
                    mode: CanvasMode.none
                })
            }

            history.resume();
        },
        [
            camera,
            canvasState,
            history,
            insertLayer
        ]
    )

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
                    w-[100vw] border-black border-2
                "
                onPointerLeave={onPointerLeave}
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`,
                    }}
                >
                    {layerIds.map((layerId) => (
                        <LayerPreview 
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={() => {}}
                            selectionColor={"#000"}
                        />
                    ))}
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
}