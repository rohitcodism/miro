'use client'

import { Camera, Color } from "@/Types/Canvas"
import { useSelectionBounds } from "@/hooks/useSelectionBounds";
import { useMutation, useSelf } from "@/liveblocks.config";
import { memo } from "react"
import { ColorPicker } from "./ColorPicker";

interface SelectionToolsProps {
    camera: Camera,
    setLastUsedColor: (color: Color) => void
}

export const SelectionTools = memo(({
    camera,
    setLastUsedColor
}:SelectionToolsProps) => {

    const selection = useSelf((me) => me.presence.selection);

    const selectionBounds = useSelectionBounds();

    const setFill = useMutation((
        {storage},
        fill: Color
    ) => {

        const liveLayers = storage.get("layers")
        setLastUsedColor(fill);

        selection.forEach((id) => {
            liveLayers.get(id)?.set("fill", fill);
        })

    }, [
        selection,
        setLastUsedColor
    ])

    if(!selectionBounds){
        return null;
    }

    const x = selectionBounds.height / 2 + selectionBounds.x + camera.x;

    const y = selectionBounds.y + camera.y;

    return(
        <div
            className="
                absolute
                p-3
                rounded-xl
                bg-white
                shadow-sm
                border
                flex
                select-none
            "

            style={{
                transform: `translate(
                    calc(${x}px - 50%),
                    calc(${y-16}px - 100%)
                )`
            }}
        >
            <ColorPicker 
                onChange={setFill}
            />
        </div>
    );
});

SelectionTools.displayName = "SelectionTools"