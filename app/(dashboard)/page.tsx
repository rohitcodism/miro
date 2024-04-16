import React from 'react'
import EmptyOrg from './_components/EmptyOrg';
import { useOrganization } from '@clerk/nextjs';

function Dashboard() {

    const { organization } = useOrganization();

    return (
        <div
            className='
                flex-1
                h-[calc(100%-80px)]
                p-6
            '
        >
            {organization ? <EmptyOrg /> : (
                <p>
                    Boards list here
                </p>
            )}
        </div>
    )
}

export default Dashboard;
