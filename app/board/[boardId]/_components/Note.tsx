import { Kalam, Delius } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { cn, ColorToCSS, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";
import { NoteLayer, TextLayer } from "@/Types/Canvas";


const font = Kalam({
    subsets: ["latin"],
    weight: ["400"]
})

const calculateFontSize = (
    width: number,
    height: number
) => {
    const maxFontSize = 96;
    const scaleFactor = 0.25;

    const fsWidth = width * scaleFactor;

    const fsHeight = height * scaleFactor;

    return Math.min(
        fsHeight,
        fsWidth,
        maxFontSize
    )
}

interface NoteProps {
    id: string,
    layer: NoteLayer,
    onPointerDown: (e: React.PointerEvent, id: string) => void,
    selectionColor?: string
}

export const Note = ({
    id,
    layer,
    onPointerDown,
    selectionColor
}: NoteProps) => {
    const { x, y, width, height, fill, value } = layer;

    const updateValue = useMutation((
        {storage},
        newValue: string
    ) => {
        const liveLayers = storage.get('layers');

        liveLayers.get(id)?.set("value", newValue);

    }, []);

    const handleContentChange = (e: ContentEditableEvent) => {
        updateValue(e.target.value);
    }

    return (
        <foreignObject
            x={x}
            y={y}
            width={width}
            height={height}
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                outline: selectionColor ? `1px solid ${selectionColor}` : "none",
                backgroundColor: fill ? ColorToCSS(fill) : "#000"
            }}
            className=" shadow-md drop-shadow-xl"
        >
            <ContentEditable
                html={value || ""}
                onChange={handleContentChange}
                className={cn(
                    "h-full w-full flex items-center justify-center text-center outline-none",
                    font.className
                )}
                style={{
                    color: fill ? getContrastingTextColor(fill) : "#000",
                    fontSize: calculateFontSize(width, height)
                }}
            />
        </foreignObject>
    );
}

