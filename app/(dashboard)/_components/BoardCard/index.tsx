'use client'
import Image from "next/image";
import Link from "next/link";
import svg13 from "../../../../public/placeholders/13.svg";

interface BoardCardProps {
    id: string,
    title: string,
    imageUrl: string,
    authorId: string,
    authorName: string,
    at: number,
    isFavorite: boolean,
}

export const BoardCard = ({id, title, imageUrl, authorId, authorName, at, isFavorite}: BoardCardProps) => {

    const refactoredImageUrl = "../../../".concat(imageUrl);

    console.log(imageUrl);

    console.log(refactoredImageUrl);


    return(
        <Link
            href={`/board/${id}`}
        >
            <div
                className="
                    group
                    aspect-[100/127]
                    border
                    rounded-lg
                    flex
                    flex-col
                    justify-between
                    overflow-hidden
                "
            >
                <div
                    className="
                        relative
                        flex-1
                        bg-amber-50
                    "
                >
                    <Image 
                        src={refactoredImageUrl}
                        alt={title}
                        fill
                        className="object-fit"
                    />
                </div>
            </div>
        </Link>
    );
}