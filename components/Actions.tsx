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

    const editTitle = useMutation(api.board.editTitle)

    const { toast } = useToast();

    const remove = useMutation(api.board.remove);
    const [formData, setFormData] = useState({ title: "" });

    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newTitle = formData.title;

        try {
            editTitle({ id: id as Id<'boards'>, title: formData.title })

                .then(() => toast({
                    title: "Renamed!",
                    description: `${title} board renamed to ${newTitle} board`
                }))
                .catch(() => toast({
                    title: "Error!",
                    description: `Something went wrong while renaming the ${title} board`,
                    variant: 'destructive'
                }))

        } catch (error) {
            toast({
                title: "Error!",
                description: `Something went wrong while renaming the ${title} board`,
                variant: 'destructive'
            })
        }

        formData.title = "";
    };




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
        <div className='absolute z-50 top-1 right-1'>
            <Dialog>
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
                        <DialogTrigger
                            className='w-full'
                            onClick={(e) => e.stopPropagation()}
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
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Rename
                                </div>

                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DialogTitle>Rename Board</DialogTitle>
                            <form onSubmit={handleSave}>
                                <div className="flex flex-col py-2 gap-y-4">
                                    <Label>Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="New board title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                    <DialogClose
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button type="submit">Save Changes</Button>
                                    </DialogClose>
                                </div>
                            </form>
                        </DialogContent>
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
            </Dialog>
        </div>
    );
}