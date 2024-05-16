'use client'

import { LayerType } from "@/Types/Canvas";
import { useStorage } from "@/liveblocks.config";
import { memo } from "react";
import { Rectangle } from "./Rectangle";
import { Ellipse } from "./Ellipse";
import { Text } from "./Text";

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

    if (!layer) {
        return;
    }

    switch (layer.type) {
        case LayerType.Rectangle:

            return (
                <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
        case LayerType.Ellipse:
            return (
                <Ellipse
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
        case LayerType.Text:
            return(
                <Text 
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            );
        default:
            return null;
    }
});

LayerPreview.displayName = "LayerPreview"