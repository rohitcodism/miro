import { Loader2 } from "lucide-react";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";



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
            <Info.Skeleton />
            <Participants.Skeleton />
            <Toolbar.Skeleton />
        </main>
    );
}