"use client"
import { useTheme } from '@/app/context/ThemeContext'
import { CopyrightIcon } from 'lucide-react'
import React from 'react'


const Copyright = () => {
    const { expanded } = useTheme()
    const text = "All rights reserved"
    return (
        <>
            <div title='All rights reserved' className='w-full justify-center items-center pr-1 flex py-2'>
                <CopyrightIcon />
                <span
                    className={`overflow-hidden flex items-center justify-center duration-300 transition-all ease-in-out ${expanded ? "w-52 ml-2" : "w-0"
                        }`}
                >
                    {text}
                </span>
            </div>
        </>
    )
}

export default Copyright