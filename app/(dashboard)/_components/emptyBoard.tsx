'use client'

import React from 'react';
import Image from 'next/image';
import { emptyBoards } from '@/assets';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';

function EmptyBoard() {

    const { organization } = useOrganization();
    const create = useMutation(api.board.create);

    const handleClick = () => {

        console.log("Button Clicked!!")

        if(!organization) return;

        try {
            create(
                {
                    title: "Untitled",
                    orgId: organization.id
                }
            )
            console.log("Try Block Executed!!");
        } catch (error) {
            console.log("Error while creating a board!!", error);
        }

        console.log("Function executed!!")
    }

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
                onClick={handleClick}
            >
                Create a new board
            </Button>
        </div>
    )
}

export default EmptyBoard
