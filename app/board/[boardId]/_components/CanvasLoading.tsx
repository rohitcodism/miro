import { Loader2 } from "lucide-react";
import { InfoSkeleton } from "./Info";
import { ParticipantsSkeleton } from "./Participants";
import { ToolbarSkeleton } from "./Toolbar";



export const CanvasLoading = () => {
    return (
        <main
            className="
            h-full
            w-full
            relative
            bg-neutral-100
            touch-none
            flex
            items-center
            justify-center
        "
        >
            <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
            <InfoSkeleton />
            <ParticipantsSkeleton />
            <ToolbarSkeleton />
        </main>
    );
}