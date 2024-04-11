import React from 'react'
import NewButton from './NewButton';

function SideBar() {
    return (
        <aside
            className='
                fixed
                z-[1]
                left-0
                bg-blue-950
                h-full
                p-3
                w-[60px]
                flex-col
                gap-y-4
                text-white
            '
        >
            <NewButton />
        </aside>
    )
}

export default SideBar;
