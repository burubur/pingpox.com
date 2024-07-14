"use client";

import { usePathname } from 'next/navigation';

export default function Content() {
    const pathName = usePathname();

    return (
        <div className="flex-grow flex justify-center">
            <div className="w-4/5 flex flex-col p-4 self-center">
                <p className="self-center">
                    {pathName} content is under construction ...
                </p>
            </div>
        </div>
    )
}