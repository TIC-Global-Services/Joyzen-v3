"use client"
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'
import ChallengeHealthcare from '@/components/home/ChallengeHealthcare'

const WhyJoyzenBadge = dynamic(() => import('@/components/home/WhyJoyzenBadge'), { ssr: false })
const IntegrationSection = dynamic(() => import('@/components/home/IntegrationSection'), { ssr: false })
const DoctorGain = dynamic(() => import('@/components/home/DoctorGain'), { ssr: false })
const DoctorAdvantage = dynamic(() => import('@/components/home/DoctorAdvantage'), { ssr: false })
const BePart = dynamic(() => import('@/components/home/BePart'), { ssr: false })
const IntakeForm = dynamic(() => import('@/components/home/IntakeForm'), { ssr: false })
const PopupForm = dynamic(() => import('@/components/home/PopupForm'), { ssr: false })

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <main className="overflow-hidden">
      <Hero />
      <ChallengeHealthcare />
      <WhyJoyzenBadge />
      <IntegrationSection />
      <DoctorGain />
      <DoctorAdvantage />
      <BePart />
      <IntakeForm />

      <button
        onClick={() => setPopupOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-white/10 border-[0.75px] border-white/30 shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 text-sm font-medium hover:border-[#036132]/30 active:scale-95 backdrop-blur-md transition-all duration-300 cursor-pointer font-noria"
      >
        Quick Enquiry
      </button>

      <PopupForm isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
    </main>
  );
}
