"use client"

import React from 'react';
import { useOrganizationList } from '@clerk/nextjs';
import Item from './Item';

function OrgList() {

    const { userMemberships } = useOrganizationList({
        userMemberships: {
            infinite:  true,
        }
    });

    if(!userMemberships.data?.length) return null;

    return (
        <ul
            className='space-y-4 flex flex-col items-center mb-4'
        >
            {userMemberships.data?.map((mem) => (
                <Item 
                    key={mem.organization.id}
                    name={mem.organization.name}
                    id={mem.organization.id}
                    imageUrl={mem.organization.imageUrl}
                />
            ))}
        </ul>
    )
}

export default OrgList
