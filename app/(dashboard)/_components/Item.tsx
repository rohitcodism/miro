import { cn } from '@/lib/utils';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';
import Hint from '@/components/Hint';

interface ItemProps {
    id: string,
    name: string,
    imageUrl: string,
}

function Item({ id, name, imageUrl }: ItemProps) {

    const { organization } = useOrganization();

    const { setActive } = useOrganizationList();

    const isActive = organization?.id === id;

    const handleClick = () => {
        if (!setActive) return;

        setActive({ organization: id });
    }

    return (
        <div
            className='
                aspect-square
                relative
            '
        >
            <Hint
                label={name}
                side='right'
                align='start'
                sideOffset={18}
            >
                <Image
                    src={imageUrl}
                    alt={name}
                    onClick={() => {
                        handleClick
                    }}
                    className={cn(
                        "rounded-md, opacity-75, hover:opacity-100, transition",
                        isActive && "opacity-100"
                    )}
                    height={30}
                    width={30}
                />
            </Hint>
        </div>
    )
}

export default Item;
