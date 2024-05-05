'use client'
import { memo } from "react";
import { useOther, useOthersConnectionIds } from "@/liveblocks.config";
import { Cursor } from "./Cursor";

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


export const CursorPresence = memo(() => {
    return(
        <>
            { /* //TODO: Draft pencil component */}
            <Cursors />
        </>
    );
});

CursorPresence.displayName = "CursorPresence"