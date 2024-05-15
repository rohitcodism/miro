'use client'

import { LayerType, Side, XYWH } from "@/Types/Canvas";
import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { useSelf, useStorage } from "@/liveblocks.config";
import { memo } from "react";

interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
    selectionColor?: string     // TODO: Try to do the user connection color //
}

const HANDLE_WIDTH = 8;


export const SelectionBox = memo(({
    onResizeHandlePointerDown
}: SelectionBoxProps) => {

    const soleLayerId = useSelf((self) => self.presence.selection.length === 1 ? self.presence.selection[0] : null);

    const isShowingHandles = useStorage((root) => soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path);

    const bounds = useSelectionBounds();

    if (!bounds) {
        return null;
    }

    return (
        <>
            <rect
                className=" fill-transparent stroke-blue-500 pointer-events-none"
                style={{
                    transform: `translate(${bounds.x}px, ${bounds.y}px)`
                }}
                x={0}
                y={0}
                rx={5}
                ry={5}
                strokeWidth={2}
                height={bounds.height}
                width={bounds.width}
            />
            {
                isShowingHandles && (
                    <>
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "nwse-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${-0.5 +  bounds.x - HANDLE_WIDTH / 2}px, 
                                    ${ bounds.y - HANDLE_WIDTH / 2}px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "ns-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
                                    ${bounds.y - HANDLE_WIDTH / 2}px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "nesw-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${ bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                    ${ bounds.y - HANDLE_WIDTH / 2}px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "ew-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${0.5 + bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                    ${ bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2 }px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "nwse-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${0.5 + bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                                    ${ bounds.y + bounds.height - HANDLE_WIDTH / 2 }px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "ns-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${bounds.x - HANDLE_WIDTH / 2  + bounds.width / 2}px, 
                                    ${ bounds.y + bounds.height - HANDLE_WIDTH / 2 }px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "nesw-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${0.5 + bounds.x - HANDLE_WIDTH / 2}px, 
                                    ${ bounds.y + bounds.height - HANDLE_WIDTH / 2 }px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                        <rect
                            className="
                            fill-white stroke-1 stroke-blue-500
                        "
                            x={0}
                            y={0}
                            style={{
                                cursor: "ew-resize",
                                width: `${HANDLE_WIDTH}px`,
                                height: `${HANDLE_WIDTH}px`,
                                transform: `translate(
                                    ${ bounds.x - HANDLE_WIDTH / 2}px, 
                                    ${ bounds.y + bounds.height/2 - HANDLE_WIDTH / 2 }px
                                )`
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                            }}
                        />
                    </>
                )
            }
        </>
    );
})

SelectionBox.displayName = "SelectionBox"