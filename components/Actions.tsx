'use client'

import { DropdownMenuContentProps, Label } from '@radix-ui/react-dropdown-menu'
import React, { FormEvent, useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Link2, Pencil, Trash2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { ConfirmModal } from './ConfirmModal';
import { useRenameModal } from '@/store/useRenameModal';



interface ActionProps {
    children: React.ReactNode,
    side?: DropdownMenuContentProps['side'],
    sideOffset?: DropdownMenuContentProps['sideOffset'],
    id: string,
    title: string,
}

export const Actions = (
    {
        children,
        side,
        sideOffset,
        id,
        title
    }: ActionProps
) => {

    const { onOpen } = useRenameModal();

    const { toast } = useToast();

    const remove = useMutation(api.board.remove);

    const onCopyLink = () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/board/${id}`
        )
            .then(() => toast({
                title: "Copied!",
                description: "Successfully copied the board link"
            }))
            .catch(() => toast({
                title: "Oops!",
                description: "Can't copy the board link",
                variant: "destructive",
            }))
    }

    const onDelete = async () => {
        remove({ id: id as Id<"boards"> })
            .then(() => toast({
                title: "Deleted",
                description: `Successfully deleted ${title} board`
            }))
            .catch(() => toast({
                title: "Oops!",
                description: `Sorry!, can't delete ${title} board`
            }))
    }

    return (
        <div className=' z-50 top-1 right-1'> {/* //TODO: Learn again about absolute property */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {children}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side={side}
                        sideOffset={sideOffset}
                        className='
                        w-60
                    '
                        onClick={(e) => { e.stopPropagation() }}
                    // TODO: Learn about stop propagation event
                    >
                        <DropdownMenuItem
                            className='
                            p-3
                            cursor-pointer
                        '
                            onClick={onCopyLink}
                        >
                            <div
                                className='
                                group 
                                flex 
                                items-center 
                                group-hover:text-green-500 
                                transition-colors
                            '
                            >
                                <Link2
                                    className='
                                h-4
                                w-4
                                mr-2
                            '
                                />
                                Copy board link
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className='
                            p-3
                            cursor-pointer
                        '
                            onClick={() => onOpen(id, title)}
                        >
                            <div
                                className='
                                group 
                                flex 
                                items-center 
                                group-hover:text-green-500 
                                transition-colors
                            '
                            >
                                <Pencil
                                    className='
                                h-4
                                w-4
                                mr-2
                            '
                                />
                                Rename board
                            </div>
                        </DropdownMenuItem>
                        <ConfirmModal
                            header='Do you really want to delete this board ?'
                            description={`This will delete the ${title} board and all of its content`}
                            disabled={false}
                            onConfirm={onDelete}
                        >
                            <Button
                                variant={'ghost'}

                                className='
                                    p-3
                                    cursor-pointer
                                    text-sm
                                    w-full
                                    justify-start
                                    font-normal
                                '
                            >
                                <div className="group flex items-center group-hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </div>
                            </Button>
                        </ConfirmModal>
                    </DropdownMenuContent>
                </DropdownMenu>
        </div>
    );
}