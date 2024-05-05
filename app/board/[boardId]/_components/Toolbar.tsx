import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react";
import { ToolButton } from "./ToolButton";
import { CanvasMode, CanvasState, LayerType } from "@/Types/Canvas";

interface ToolBarProps {
    canvasState: CanvasState,
    setCanvasState: (newState: CanvasState) => void,
    undo: () => void,
    redo: () => void,
    canUndo: boolean,
    canRedo: boolean
};


export const Toolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo
}:ToolBarProps) => {
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
                    onClickAction={() => setCanvasState({ mode: CanvasMode.none })}
                    isActive={
                        canvasState.mode === CanvasMode.none ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }

                />
                <ToolButton
                    label="Text"
                    icon={Type}
                    onClickAction={() => setCanvasState({ mode: CanvasMode.Inserting, layerType: LayerType.Text})}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Text
                    }
                />
                <ToolButton
                    label="Sticky note"
                    icon={StickyNote}
                    onClickAction={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Note
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Note
                    }

                />
                <ToolButton
                    label="Rectangle"
                    icon={Square}
                    onClickAction={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Rectangle
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Rectangle
                    }

                />
                <ToolButton
                    label="Ellipse"
                    icon={Circle}
                    onClickAction={() => setCanvasState({
                        mode: CanvasMode.Inserting,
                        layerType: LayerType.Ellipse
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.layerType === LayerType.Ellipse
                    }

                />
                <ToolButton
                    label="Pen"
                    icon={Pencil}
                    onClickAction={() => setCanvasState({
                        mode: CanvasMode.Pencil
                        
                    })}
                    isActive={
                        canvasState.mode === CanvasMode.Pencil
                    }

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
                    onClickAction={undo}
                    isActive={false}
                    isDisabled={!canUndo}

                />
                <ToolButton
                    label="Redo"
                    icon={Redo2}
                    onClickAction={redo}
                    isActive={false}
                    isDisabled={!canRedo}
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