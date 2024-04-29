'use client'

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

interface NewBoardButtonProps {
    orgId: string,
    disabled: boolean,
}

export const NewBoardButton = (
    {
        orgId,
        disabled
    }: NewBoardButtonProps
) => {

    const { toast } = useToast();

    const [formData, setFormData] = useState({ title: '' });

    const { mutate, pending } = useApiMutation(api.board.create);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!orgId) return;

        const boardTitle = formData.title;

        try {
            const result = await mutate(
                {
                    title: boardTitle,
                    orgId: orgId
                }
            )

            if (result) {
                toast({
                    title: "Success",
                    description: "New board created successfully",
                })
            } else {
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
        } finally {
            formData.title = "";
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className={`
                    group
                    col-span-1
                    aspect-[100/127]
                    border
                    rounded-lg
                    flex
                    flex-col
                    justify-center
                    items-center
                    gap-y-4
                    overflow-hidden
                    bg-indigo-600
                    bg-opacity-80
                    hover:bg-indigo-700
                    hover:transition
                    ${pending && 'opacity-75 cursor-not-allowed'}
                    cursor-pointer
                `}
                >
                    <p
                        className="
                            text-lg
                            font-medium
                            text-white
                        "
                    >
                        New board
                    </p>
                    <Plus
                        className="
                            text-white
                        "
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[350px] flex flex-col justify-evenly">
                <DialogHeader>
                    <DialogTitle>Create new board</DialogTitle>
                    <DialogDescription>
                        Add a title for the new board
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="flex justify-start items-center py-2">
                        <div className="flex justify-center items-center gap-4">
                            <Label>
                                Title
                            </Label>
                            <Input
                                id="title"
                                placeholder="New board"
                                className="col-span-3"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-end">
                        <DialogClose>
                            <Button className="mt-2" type="submit">
                                Create
                            </Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}