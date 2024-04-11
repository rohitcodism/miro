import React from 'react';
import { Plus } from 'lucide-react';
import { CreateOrganization } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function NewButton() {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div
                        className='
                            aspect-square
                        '
                    >
                        <button
                            className='
                                rounded-full
                                bg-white/25
                                h-full
                                w-full
                                flex
                                items-center
                                justify-center
                                opacity-60
                                hover:opacity-100
                                transition
                            '
                        >
                            <Plus className='text-white' />
                        </button>
                    </div>
                </DialogTrigger>
                <DialogContent
                    className='
                        p-0
                        bg-transparent
                        border-none
                        maz-w-[480px]
                    '
                >
                    <CreateOrganization />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewButton;
