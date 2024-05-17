'use client'

import { useHistory, useSelf, useCanUndo, useCanRedo, useMutation, useStorage, useOthers, useOthersMapped } from "@/liveblocks.config";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/Types/Canvas";
import { CursorPresence } from "./CursorPresence";
import { ColorToCSS, ResizeBounds, connectionIdToColor, findIntersectingLayersWithRectangle, penPointToPathLayer, pointerEventToCanvasPoint } from "@/lib/utils";
import { nanoid } from 'nanoid';
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./LayerPreview";
import { SelectionBox } from "./SelectionBox";
import { SelectionTools } from "./SelectionTools";
import { findDOMNode } from "react-dom";
import { Path } from "./Path";
import { useDisableScrollBounce } from "@/hooks/useDisableScrollBounce";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";

const MAX_LAYERS = 100;

interface CanvasProps {
    boardId: string
}


export const Canvas = ({
    boardId
}: CanvasProps) => {

    const[canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.none
    })

    const pencilDraft = useSelf((me) => me.presence.pencilDraft);


    const layerIds = useStorage((root) => root.layerIds);

    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 255,
        g: 255,
        b: 255
    })

    const [camera, setCamera] = useState<Camera>({x: 0, y: 0}); //TODO: Study about how the camera is working

    useDisableScrollBounce();

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

    const translateSelectedLayer = useMutation((
        {self, storage},
        point: Point
    ) => {
        if(canvasState.mode !== CanvasMode.Translating){
            return;
        }

        const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y
        };

        const liveLayers = storage.get("layers");

        for(const id of self.presence.selection){
            const layer = liveLayers.get(id);

            if(layer){
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y
                })
            }
        }

        setCanvasState({
            mode: CanvasMode.Translating,
            current: point
        })
    },[
        canvasState
    ]);

    const unSelectLayers = useMutation((
        {self, setMyPresence}
    ) => {
        if(self.presence.selection.length > 0){
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const updateSelectionNet = useMutation((
        {setMyPresence, storage},
        current: Point,
        origin: Point
    ) => {
        const layers = storage.get('layers').toImmutable();

        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current
        })

        const ids = findIntersectingLayersWithRectangle(
            layerIds, 
            layers, 
            origin, 
            current
        );

        setMyPresence({selection: ids});
    },[layerIds])

    const startMultiSelection = useCallback((
        current: Point,
        origin: Point
    ) => {
        console.log("Selection net activated.")
        if(Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5){
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current
            })
        }
    }, []);

    const continueDrawing = useMutation((
        {self, setMyPresence},
        point: Point,
        e: React.PointerEvent
    ) =>{
        const { pencilDraft } = self.presence;

        if(
            canvasState.mode !== CanvasMode.Pencil ||
            e.buttons !== 1 ||
            pencilDraft == null
        ){
            return;
        }

        setMyPresence({
            cursor : point,
            pencilDraft:
                pencilDraft.length == 1 &&
                pencilDraft[0][0] == point.x &&
                pencilDraft[0][1] == point.y
                ? pencilDraft : 
                [...pencilDraft, [point.x, point.y, e.pressure]]
        })

    }, [canvasState.mode]);

    const insertPath = useMutation((
        {storage, self, setMyPresence}
    ) => {
        const liveLayers = storage.get('layers');

        const { pencilDraft } = self.presence;

        if(pencilDraft == null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS){
            setMyPresence({
                pencilDraft: null,
            })
            return;
        }

    const id = nanoid();

    liveLayers.set(
        id,
        new LiveObject(penPointToPathLayer(
            pencilDraft,
            lastUsedColor
        ))
    );

    const liveLayerIds = storage.get('layerIds');
    liveLayerIds.push(id);

    setMyPresence({ pencilDraft: null });

    setCanvasState({ mode: CanvasMode.Pencil })

    }, [lastUsedColor])

    const startDrawing = useMutation((
        {setMyPresence},
        point: Point,
        pressure: number,
    ) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastUsedColor
        })
    }, [lastUsedColor]);

    const resizeSelectedLayer = useMutation((
        {storage, self},
        point: Point
    ) => {
        if(canvasState.mode !== CanvasMode.Resizing){
            return;
        }

        const bounds = ResizeBounds(
            canvasState.initialBounds,
            canvasState.corner,
            point
        )

        const livLayers = storage.get("layers");

        const layer = livLayers.get(self.presence.selection[0]);

        if(layer){
            layer.update(bounds)
        }
    }, [canvasState]);

    const onResizeHandlePointerDown = useCallback((
        corner: Side,
        initialBounds: XYWH
    ) => {

        history.pause();

        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds: initialBounds,
            corner: corner
        });



    }, [history]);

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY
        }))
    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e:React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);

        if(canvasState.mode === CanvasMode.Pressing){
            startMultiSelection(current, canvasState.origin);
        }
        else if(canvasState.mode === CanvasMode.SelectionNet){
            updateSelectionNet(current, canvasState.origin);
        }
        else if(canvasState.mode === CanvasMode.Translating){

            translateSelectedLayer(current);
        }

        else if(canvasState.mode === CanvasMode.Resizing){

            resizeSelectedLayer(current)
        }
        else if(canvasState.mode === CanvasMode.Pencil){
            continueDrawing(current, e);

        }

        setMyPresence({ cursor: current });
    }, [canvasState, resizeSelectedLayer, camera, translateSelectedLayer , continueDrawing, startMultiSelection, updateSelectionNet])

    const onPointerLeave = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        setMyPresence({
            cursor: null
        })
    }, [])

    const onPointerDown = useCallback((
        e: React.PointerEvent
    ) => {
        const point = pointerEventToCanvasPoint(e,camera);

        if(canvasState.mode === CanvasMode.Inserting){
            return;
        }

        //TODO: Add case for drawing
        if(canvasState.mode === CanvasMode.Pencil){
            startDrawing(point, e.pressure);
            return;
        }

        setCanvasState({
            mode: CanvasMode.Pressing,
            origin: point
        })
    }, [camera, canvasState.mode, setCanvasState, startDrawing])

    const onPointerUp = useMutation((
            {},
            e
        ) => {

            const point = pointerEventToCanvasPoint(e, camera);

            if(canvasState.mode === CanvasMode.none || canvasState.mode === CanvasMode.Pressing){

                unSelectLayers();
                setCanvasState({
                    mode: CanvasMode.none
                })
            } else if(canvasState.mode === CanvasMode.Pencil){
                insertPath();
            }
            else if(canvasState.mode === CanvasMode.Inserting){
                insertLayer(canvasState.layerType, point);
                
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
            insertLayer,
            unSelectLayers,
            insertPath,
            setCanvasState
        ]
    )

    const onLayerPointerDown = useMutation((
        {self, setMyPresence},
        e: React.PointerEvent,
        layerId: string
    ) => {
        if(canvasState.mode === CanvasMode.Pencil || canvasState.mode ===CanvasMode.Inserting){
            return;
        }

        history.pause(); //* Learn *//
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if(!self.presence.selection.includes(layerId)){
            setMyPresence(
                {
                    selection: [layerId]
                },
                {
                    addToHistory: true
                }
            )
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point });

    },[
        setCanvasState,
        history,
        camera,
        canvasState.mode
    ])

    const info = useSelf((me) => me.info); // TODO: Remove //

    const selections = useOthersMapped((other) => other.presence.selection);

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for(const user of selections){
            const [connectionId, selection] = user;

            for(const layerId of selection){
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
            }
        }

        return layerIdsToColorSelection;
    },[selections])

    const deleteLayers = useDeleteLayers();

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            switch(e.key){

                // case "Backspace":
                //     deleteLayers();
                //     break;

                case "z": {
                    if(e.ctrlKey || e.metaKey){
                        if(e.shiftKey){
                            history.redo();
                        }
                        else{
                            history.undo();
                        }
                        break;
                    }
                }
            }
        }

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [deleteLayers, history])

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
            <SelectionTools 
                camera={camera}
                setLastUsedColor={setLastUsedColor}
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
                onPointerDown={onPointerDown}
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
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox 
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    {
                        canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
                            <rect 
                                className=" fill-blue-500/5 stroke-blue-500 stroke-2"
                                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                            />
                        )
                    }
                    <CursorPresence />
                    {pencilDraft != null && pencilDraft.length > 0 && (
                        <Path
                            points={pencilDraft}
                            fill={ColorToCSS(lastUsedColor)}
                            x={0}
                            y={0}
                        />
                    )}
                </g>
            </svg>
        </main>
    );
}