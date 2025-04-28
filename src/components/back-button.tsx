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
    <button onClick={handleBack} className='flex flex-wrap items-center gap-2 fill-primary pt-2'>
      <SvgSmallDown style={{ transform: 'rotate(90deg)' }}/>
      <span className='text-sm'>Retour</span>
    </button>
  )
}
