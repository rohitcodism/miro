'use client'
import { memo } from "react";
import { useOther, useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { Cursor } from "./Cursor";
import { shallow } from "@liveblocks/client";
import { Path } from "./Path";
import { ColorToCSS } from "@/lib/utils";

const Cursors = () => {
    const ids = useOthersConnectionIds();

    return(
        <>
            {
                ids.map((connectionId) => (
                    <Cursor 
                        key={connectionId}
                        connectionId={connectionId}
                    />
                ))
            }
        </>
    );
}

const Drafts = () => {
    const others = useOthersMapped((other) => ({
        pencilDraft: other.presence.pencilDraft,
        penColor: other.presence.penColor,
    }), shallow)

    return (
        <>
            {
                others.map(([key, other]) => {
                    if(other.pencilDraft){
                        return(
                            <Path 
                                key={key}
                                x={0}
                                y={0}
                                points={other.pencilDraft}
                                fill={other.penColor ? ColorToCSS(other.penColor) : "#000"}
                            />
                        );
                    }
                    return null;
                })
            }
        </>
    );
}


export const CursorPresence = memo(() => {
    return(
        <>
            <Drafts />
            <Cursors />
        </>
    );
});

CursorPresence.displayName = "CursorPresence"