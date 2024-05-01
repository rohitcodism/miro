import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { auth, currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from "next/server";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: NextRequest){
    const authorization = await auth();

    const user = await currentUser();

    console.log("AUTH_INFO : ", {
        authorization,
        user
    })

    if(!auth || !currentUser){
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized request"
            },
            {
                status: 403
            }
        )
    }

    const { room } = await req.json();

    const board = await convex.query(api.board.get, {boardId: room as Id<'boards'>});

    console.log("Room and board info : ",{
        room,
        board,
        boardOrgId: board?.orgId,
        userOrgId: authorization.orgId
    });
    

    if(board?.orgId !== authorization.orgId){
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 403
            }
        )
    }

    const userInfo = {
        name: user?.firstName || "anonymous",
        picture: user?.imageUrl
    }

    console.log("User Info : ", {userInfo})

    const session = liveblocks.prepareSession(
        user?.id!,
        {
            userInfo
        }
    )

    if(room) {
        session.allow(room, session.FULL_ACCESS);
    }

    const {status, body} = await session.authorize();

    console.log({status, body}, "ALLOWED")

    return NextResponse.json(
        body, {status: status}
    )
}
