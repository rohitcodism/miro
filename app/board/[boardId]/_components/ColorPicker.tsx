'use client'

import { Color } from "@/Types/Canvas"
import { ColorToCSS } from "@/lib/utils";

interface ColorPickerProps {
    onChange: (color: Color) => void
}

export const ColorPicker = ({
    onChange
}: ColorPickerProps) => {
    return (
        <div
            className="
                flex
                flex-wrap
                gap-2
                items-center
                max-w-[164px]
                pr-2
                mr-2
                border-r
                border-neutral-200
            "
        >
            <ColorButton
                onClick={onChange}
                color={{
                    r: 243,
                    g: 82,
                    b: 35 // Red
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 255,
                    g: 165,
                    b: 0 // Orange
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 255,
                    g: 255,
                    b: 0 // Yellow
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 0,
                    g: 128,
                    b: 0 // Green
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 0,
                    g: 0,
                    b: 255 // Blue
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 75,
                    g: 0,
                    b: 130 // Indigo
                }}
            />
            <ColorButton
                onClick={onChange}
                color={{
                    r: 0,
                    g: 0,
                    b: 0 // Black
                }}
            />
                        <ColorButton
                onClick={onChange}
                color={{
                    r: 255,
                    g: 255,
                    b: 255 // White
                }}
            />
        </div>
    );
}

interface ColorButtonProps {
    onClick: (color: Color) => void,
    color: Color
};

const ColorButton = ({
    onClick,
    color
}: ColorButtonProps) => {
    return (
        <button
            className="
                w-8
                h-8
                items-center
                flex
                justify-center
                hover:opacity-75
                transition
            "
            onClick={() => onClick(color)}
        >
            <div
                className="
                    h-8
                    w-8
                    rounded-md
                    border
                    border-neutral-300
                "
                style={{
                    background: ColorToCSS(color)
                }}
            />
        </button>
    );
}