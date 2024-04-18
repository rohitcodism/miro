import React from 'react';
import Image from 'next/image';
import { emptyBoards } from '@/assets';
import { Button } from '@/components/ui/button';

function EmptyBoard() {
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
                src={emptyBoards}
                alt='empty-search'
                height={110}
                width={110}
            />
            <h2
                className='
                    text-2xl
                    font-semibold
                    mt-6
                '
            >
                No boards found!
            </h2>
            <p
                className='
                    text-muted-foreground
                    text-sm
                    mt-2
                '
            >
                Try to create a new board
            </p>
            <Button
                className='
                    mt-4
                '
                size={'lg'}
            >
                Create a new board
            </Button>
        </div>
    )
}

export default EmptyBoard
