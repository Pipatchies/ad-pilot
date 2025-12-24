"use client"
import React from 'react'
import SvgSmallDown from './icons/SmallDown'
import { useRouter } from 'next/navigation'



export default function BackButton() {
    const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <button onClick={handleBack} className='flex flex-row items-center gap-2 fill-primary pt-1 cursor-pointer hover:opacity-80 transition-opacity'>
      <div className="w-6 h-6 flex items-center justify-center">
         <SvgSmallDown style={{ transform: 'rotate(90deg)', width: '20px', height: '20px' }}/>
      </div>
      <span className='text-md font-medium'>Retour</span>
    </button>
  )
}
