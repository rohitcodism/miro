'use client'

import { useOthers, useSelf } from "@/liveblocks.config";
import { UserAvatar } from "./UserAvatar";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_USERS = 2;

export const Participants = () => {

    const users = useOthers(); //TODO: Learn more about useOthers hook

    const currentUser = useSelf();

    const hasMoreUsers = users.length > MAX_SHOWN_USERS;

    return (
        <div
            className="
                absolute
                h-12
                top-2
                right-2
                bg-white
                rounded-md
                p-3
                flex
                items-center
                shadow-md
            "
        >
            <div
                className="
                    flex
                    gap-x-2
                "
            >
                {users.slice(0,MAX_SHOWN_USERS).map(({connectionId, info}) => {

                    if(currentUser.connectionId !== connectionId){
                        return(
                            <UserAvatar 
                                key={connectionId}
                                src={info?.picture} //*Issue with picture property
                                name={info?.name}
                                borderColor={connectionIdToColor(connectionId)}
                                fallback={info?.name?.[0] || 'A'}
                            />
                        );
                    }else{
                        console.log('false');
                    }
                })}

                {
                    currentUser && (
                        <UserAvatar 
                            src={currentUser?.info?.picture}
                            name={currentUser?.info?.name}
                            borderColor={connectionIdToColor(currentUser.connectionId)}
                            fallback={currentUser?.info?.name?.[0] || 'A'}
                        />
                    )
                }

                {
                    hasMoreUsers && (
                        <UserAvatar 
                            name={`${users.length - MAX_SHOWN_USERS} more`}
                            fallback={`+ ${users.length - MAX_SHOWN_USERS}`}
                        />
                    )
                }

            </div>
        </div>
    );
}

export const ParticipantsSkeleton = () => {
    return (
        <div
        className="
            absolute
            h-12
            top-2
            right-2
            bg-white
            rounded-md
            p-3
            flex
            items-center
            shadow-md
            w-[100px]
            animate-pulse
        "
        />
    );
}