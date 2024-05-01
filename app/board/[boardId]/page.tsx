import React from 'react'
import { Canvas } from './_components/Canvas';

interface BoardIdProps  {
    params: {
        boardId: string
    }
}

const BoardId = ({
    params
}: BoardIdProps) => {
    return (
        <div
            className='
                h-screen
                w-full
            '
        >
            <Canvas boardId={params.boardId} />
        </div>
    )
}

export default BoardId;