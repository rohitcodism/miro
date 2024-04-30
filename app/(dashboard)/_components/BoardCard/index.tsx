'use client'
import Image from "next/image";
import Link from "next/link";
import svg13 from "../../../../public/placeholders/13.svg";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from 'date-fns';
import { useAuth, useOrganization } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/Actions";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Id } from '@/convex/_generated/dataModel';

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

    const { toast } = useToast();

    const { userId } = useAuth();

    const { organization } = useOrganization();

    const orgId = organization?.id;

    const authorLabel = userId === authorId ? "you" : authorName;

    const createdAtLabel = formatDistanceToNow(at, {
        addSuffix: true,
    })

    const {
        mutate: onFavorite,
        pending: pendingFavorite
    } = useApiMutation(api.board.doFavorite)

    const {
        mutate: onUnfavorite,
        pending: pendingUnfavorite
    } = useApiMutation(api.board.undoFavorite);

    const toggleFavorite = () => {

        if(isFavorite){
            onUnfavorite({ boardId: id as Id<"boards"> })
            .then(() => toast(
                {
                    title: "Removed from favorites",
                    description: `${title} board removed from your favorites`
                }
            ))
            .catch((err) => {
                    console.log("Error in favs : ", err)
                toast(
                {
                    title: "Oops!",
                    description: `Something went wrong in removing ${title} board from your favorites`
                }
            )})
        }else{
            onFavorite({ boardId: id as Id<"boards">, orgId })
            .then(() => toast(
                {
                    title: "Added to favorites",
                    description: `${title} board added to your favorites`
                }
            ))
            .catch(() => toast(
                {
                    title: "Oops!",
                    description: `Something went wrong in adding ${title} board to your favorites`
                }
            ))
        }

    }


    return (
        <Link
            href={`/board/${id}`}
        >
            <div
                className="
                    group
                    aspect-[127/127]
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
                    <Actions id={id} title={title} side={'right'}>
                        <button
                            className="
                                absolute
                                top-1
                                right-1
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                px-3
                                py-2
                                outline-none
                            "
                        >
                            <MoreHorizontal 
                                className="
                                    text-white
                                    opacity-75
                                    hover:opacity-100
                                    transition-opacity
                                "
                            />
                        </button>
                    </Actions>
                </div>
                <Footer
                    title={title}
                    isFavorite={isFavorite}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={pendingFavorite || pendingUnfavorite}
                />
            </div>
        </Link>
    );
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return(
        <div
        className="
            aspect-[127/127]
            rounded-lg
            overflow-hidden
        "
        >
            <Skeleton className="h-full w-full" />
        </div>
    );
}