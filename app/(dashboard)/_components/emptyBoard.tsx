'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { emptyBoards } from '@/assets';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { useApiMutation } from '@/hooks/useApiMutation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function EmptyBoard() {

    const { toast } = useToast();

    const { organization } = useOrganization();

    const { mutate, pending } = useApiMutation(api.board.create);

    const handleClick = async() => {

        if(!organization) return;

        try {
            const result = await mutate(
                {
                    title: "Untitled",
                    orgId: organization.id
                }
            )

            if(result){
                toast({
                    title: "Success",
                    description: "New board created successfully",
                })
            }else{
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    variant: "destructive"
                })
            }


        } catch (error) {
            console.log("Error while creating a board!!", error);
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive"
            })
        }
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
                disabled={pending}
            >
                {pending ? (<Loader2 className='w-8 h-8 animate-spin' />) : 'Create new board'}
            </Button>
        </div>
    )
}

export default EmptyBoard
