"use client"

import React from 'react';
import qs from 'query-string';
import { Search } from 'lucide-react';
import { useDebounceValue } from 'usehooks-ts';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

function SearchInput() {

    const router = useRouter();
    const[val, setVal] = useState("");
    const debouncedValue = useDebounceValue(val,500);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setVal(e.target.value);
    }

    useEffect(() => {

        const url = qs.stringifyUrl({
            url: "/",
            query: {
                search: debouncedValue[0]
            }
        },{skipEmptyString: true, skipNull: true});
        router.push(url)
    },[debouncedValue, router])

    return (
        <div
            className='
                w-full
                relative

            '
        >
            <Search 
                className='
                    absolute
                    top-1/2
                    left-3
                    transform
                    -translate-y-1/2
                    text-muted-foreground
                    h-4
                    w-4
                '
            />
            <Input 
                className='
                    w-full
                    max-w-[516px]
                    pl-9
                '
                placeholder='Search boards'
                onChange={handleChange}
                value={val}
            />
        </div>
    )
}

export default SearchInput;
