'use client'

import { LayerType } from "@/Types/Canvas";
import { useStorage } from "@/liveblocks.config";
import { memo } from "react";
import { Rectangle } from "./Rectangle";

interface LayerPreviewProps {
    id: string
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string
}


export const LayerPreview = memo(({
    id,
    onLayerPointerDown,
    selectionColor
}: LayerPreviewProps) => {

    const layer = useStorage((root) => root.layers.get(id));
    
    if(!layer){
        return;
    }

    switch(layer.type){
        case LayerType.Rectangle:

            return(
                    <Rectangle 
                        id={id}
                        layer={layer}
                        onPointerDown={onLayerPointerDown}
                        selectionColor={selectionColor}
                    />
            );
        default:
            console.log("Unknown default layer type.");
            return null;
    }
});

LayerPreview.displayName = "LayerPreview"