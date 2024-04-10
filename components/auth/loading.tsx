import { miroIcon } from "@/assets";
import Image from "next/image";

export const Loading = () => {
    return(
        <div
            className="
                h-full
                w-full
                flex
                flex-col
                gap-y-4
                justify-center
                items-center
            "
        >
            <Image 
                src={miroIcon}
                alt="logo-miro"
                width={80}
                height={80}
                className="animate-pulse duration-700p"
            />
        </div>
    );
}