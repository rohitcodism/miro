'use client'


import React from 'react'
import EmptySearch from './emptySearch';
import EmptyFavorites from './emptyFavorites';
import EmptyBoard from './emptyBoard';

interface BoardListProps {
    orgId: string,
    query:{
        search?: string,
        favorites?: string,
    },
}

function BoardList({orgId, query}: BoardListProps) {

    const data = []; //TODO: Change to API call

    if(!data?.length && query.search){
        return <EmptySearch />
    }

    if(!data?.length && query.favorites){
        return <EmptyFavorites />
    }

    if(!data?.length){
        return <EmptyBoard />
    }

    return (
        <div>
            
        </div>
    )
}

export default BoardList
