'use client'
import Image from "next/image";
import Link from "next/link";
import svg13 from "../../../../public/placeholders/13.svg";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";

interface BoardCardProps {
    id: string,
    title: string,
    imageUrl: string,
    authorId: string,
    authorName: string,
    at: number,
    isFavorite: boolean,
}

export const BoardCard = ({ id, title, imageUrl, authorId, authorName, at, isFavorite }: BoardCardProps) => {

    const { userId } = useAuth();

    const authorLabel = userId === authorId ? "you" : authorName;

    const createdAtLabel = formatDistanceToNow(at, {
        addSuffix: true,
    })


    return (
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
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-fit"
                    />
                    <Overlay />
                </div>
                <Footer
                    title={title}
                    isFavorite={isFavorite}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={() => { }}
                    disabled={false}
                />
            </div>
        </Link>
    );
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return(
        <div
        className="
            aspect-[100/127]
            rounded-lg
            overflow-hidden
        "
        >
            <Skeleton className="h-full w-full" />
        </div>
    );
}