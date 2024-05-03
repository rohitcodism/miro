'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogClose,
    DialogFooter,
    DialogTrigger,
    DialogTitle
} from '@/components/ui/dialog';
import { useRenameModal } from '@/store/useRenameModal';
import { FormEventHandler, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useApiMutation } from '@/hooks/useApiMutation';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useToast } from '../ui/use-toast';

export const RenameModal = () => {

    const { mutate, pending } = useApiMutation(api.board.editTitle)

    const { toast } = useToast();

    
    const {
        isOpen,
        onClose,
        initialValues
    } = useRenameModal();
    
    const[title, setTitle] = useState(initialValues.title);

    useEffect(() => {
        setTitle(initialValues.title)
    }, [initialValues.title])

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        mutate({id: initialValues.id as Id<'boards'>, title})

        .then(() => toast({
            title: 'Renamed!',
            description: "Board name changed successfully!!"
        }))
        .catch(() => toast({
            title: 'Oops!',
            description: "Something went wrong"
        }))
    }

    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Title
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Enter a new title for this board
                </DialogDescription>
                <form
                    onSubmit={onSubmit}
                    className='
                        space-y-4
                    '
                >
                    <Input 
                        disabled={pending}
                        required
                        maxLength={60}
                        value={title}
                        onChange={(e) =>  setTitle(e.target.value)}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type='button'
                                variant={'outline'}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            disabled={pending}
                            type='submit'
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}