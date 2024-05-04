import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react";
import { ToolButton } from "./ToolButton";


export const Toolbar = () => {
    return (
        <div
            className="
                absolute
                top-[50%]
                -translate-y-[50%]
                left-2
                flex
                flex-col
                gap-y-4
            "
        >
            <div
                className="
                    bg-white
                    rounded-md
                    p-1.5
                    flex
                    gap-y-1
                    flex-col
                    items-center
                    shadow-md
                "
            >
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    onClickAction={() => { }}
                    isActive={false}

                />
                <ToolButton
                    label="Text"
                    icon={Type}
                    onClickAction={() => { }}
                    isActive={false}

                />
                <ToolButton
                    label="Sticky note"
                    icon={StickyNote}
                    onClickAction={() => { }}
                    isActive={false}

                />
                <ToolButton
                    label="Rectangle"
                    icon={Square}
                    onClickAction={() => { }}
                    isActive={false}

                />
                <ToolButton
                    label="Ellipse"
                    icon={Circle}
                    onClickAction={() => { }}
                    isActive={false}

                />
                <ToolButton
                    label="Pen"
                    icon={Pencil}
                    onClickAction={() => { }}
                    isActive={false}

                />
            </div>
            <div
                className="
                    bg-white
                    rounded-md
                    p-1.5
                    flex
                    flex-col
                    items-center
                    shadow-md
                "
            >
                <ToolButton
                    label="Undo"
                    icon={Undo2}
                    onClickAction={() => { }}
                    isActive={false}
                    isDisabled={true}

                />
                <ToolButton
                    label="Redo"
                    icon={Redo2}
                    onClickAction={() => { }}
                    isActive={false}
                    isDisabled={true}
                />
            </div>
        </div>
    );
}


export const ToolbarSkeleton = () => {
    return (
        <div
            className="
            absolute
            top-[50%]
            -translate-y-[50%]
            left-2
            flex
            flex-col
            gap-y-4
            bg-white
            h-[360px]
            w-[52px]
            shadow-md
            rounded-md
            animate-pulse
        "
        />
    );
}