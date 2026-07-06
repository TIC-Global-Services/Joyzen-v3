"use client"
import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'
import ChallengeHealthcare from '@/components/home/ChallengeHealthcare'

const WhyJoyzenBadge = dynamic(() => import('@/components/home/WhyJoyzenBadge'), { ssr: false })
const IntegrationSection = dynamic(() => import('@/components/home/IntegrationSection'), { ssr: false })
const DoctorGain = dynamic(() => import('@/components/home/DoctorGain'), { ssr: false })
const DoctorAdvantage = dynamic(() => import('@/components/home/DoctorAdvantage'), { ssr: false })
const BePart = dynamic(() => import('@/components/home/BePart'), { ssr: false })
const IntakeForm = dynamic(() => import('@/components/home/IntakeForm'), { ssr: false })

export default function Home() {
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
    </main>
  );
}
