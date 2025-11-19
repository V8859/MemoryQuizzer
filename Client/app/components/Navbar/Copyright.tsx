"use client"
import { useTheme } from '@/app/context/ThemeContext'
import { CopyrightIcon } from 'lucide-react'
import React from 'react'


const Copyright = () => {
    const { expanded } = useTheme()
    return (
        <>
            <div title='All rights reserved' className='w-full justify-center items-center flex gap-2 py-2 mr-2'>
                <CopyrightIcon />
                {expanded && "All rights reserved"}
            </div>
        </>
    )
}

export default Copyright