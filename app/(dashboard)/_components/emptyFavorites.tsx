import React from 'react';
import Image from 'next/image';
import { emptyFavorites } from '@/assets';

function EmptyFavorites() {
    return (
        <div
            className='
            h-full
            flex
            flex-col
            items-center
            justify-center
        '
        >
            <Image
                src={emptyFavorites}
                alt='empty-search'
                height={140}
                width={140}
            />
            <h2
                className='
                text-2xl
                font-semibold
                mt-6
            '
            >
                No favorites boards!
            </h2>
            <p
                className='
                text-muted-foreground
                text-sm
                mt-2
            '
            >
                Try to add a board to favorites 
            </p>
        </div>
    )
}

export default EmptyFavorites;
