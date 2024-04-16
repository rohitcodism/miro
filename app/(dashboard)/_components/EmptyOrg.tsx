'use client'

import { elements } from '@/assets';
import Image from 'next/image';
import React from 'react';
import { CreateOrganization } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

function EmptyOrg() {
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
                src={elements}
                alt='empty-state'
                height={200}
                width={200}
            />
            <h2
                className='
                    text-2xl
                    font-semibold
                    mt-6
                '
            >
                Welcome to Miro
            </h2>
            <p
                className='
                    text-muted-foreground
                    text-sm
                    mt-2
                '
            >
                Create an organization to get started
            </p>
            <div 
                className="mt-6"
            >
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size={'lg'}
                        >
                            Create an organization
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className='
                            p-0
                            bg-transparent
                            border-none
                            max-w-[480px]
                        '
                    >
                        <CreateOrganization />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default EmptyOrg;
