'use client'

interface InfoProps {

}

export const Info = () => {
    return (
        <div
            className="
                absolute
                top-2
                left-2
                bg-white
                rounded-md
                px-1.5
                h-12
                flex
                items-center
                shadow-md
            "
        >
            Info //TODO: Information about the board
        </div>
    );
}

export const InfoSkeleton = () => {
    return (
        <div
            className="
            absolute
            top-2
            left-2
            bg-white
            rounded-md
            px-1.5
            h-12
            flex
            items-center
            shadow-md
            w-[300px]
            animate-pulse
        "
        />
    );
}
