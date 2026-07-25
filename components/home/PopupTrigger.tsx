"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const PopupForm = dynamic(() => import('./PopupForm'), { ssr: false })

const PopupTrigger = () => {
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setPopupOpen(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return <PopupForm isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
}

export default PopupTrigger
