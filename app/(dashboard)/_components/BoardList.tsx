'use client'


import React from 'react'
import EmptySearch from './emptySearch';
import EmptyFavorites from './emptyFavorites';
import EmptyBoard from './emptyBoard';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react';
import { BoardCard } from './BoardCard';
import { NewBoardButton } from './newBoardButton';

interface BoardListProps {
    orgId: string,
    query: {
        search?: string,
        favorites?: string,
    },
}

function BoardList({ orgId, query }: BoardListProps) {

    const data = useQuery(api.boards.get, { orgId })

    if (data === undefined) {
        return (
            <div>
                <h2
                    className='
                    text-3xl
                    font-bold
                '
                >
                    {query.favorites ? "Favorite boards" : "Team boards"}
                </h2>
                <div
                    className='
                    grid
                    grid-cols-1
                    sm:grid-cols-1
                    md:grid-cols-4
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-5
                    mt-8
                    pb-10
                '
                >
                    <NewBoardButton orgId={orgId} disabled={true} />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                    <BoardCard.Skeleton />
                </div>
            </div>
        );
    }

    if (!data?.length && query.search) {
        return <EmptySearch />
    }

    if (!data?.length && query.favorites) {
        return <EmptyFavorites />
    }

    if (!data?.length) {
        return <EmptyBoard />
    }

    return (
        <div>
            <h2
                className='
                    text-3xl
                    font-bold
                '
            >
                {query.favorites ? "Favorite boards" : "Team boards"}
            </h2>
            <div
                className='
                    grid
                    grid-cols-1
                    sm:grid-cols-1
                    md:grid-cols-4
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-5
                    mt-8
                    pb-10
                '
            >
                <NewBoardButton orgId={orgId} disabled={false} />
                {
                    data.map((board) => (
                        <BoardCard
                            key={board._id}
                            id={board._id}
                            title={board.title}
                            imageUrl={board.imageUrl}
                            authorId={board.authorId}
                            authorName={board.authorName}
                            at={board._creationTime}
                            isFavorite={false}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default BoardList
