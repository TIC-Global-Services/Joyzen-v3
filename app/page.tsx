import Hero from '@/components/home/Hero'
import ChallengeHealthcare from '@/components/home/ChallengeHealthcare'
import WhyJoyzenBadge from '@/components/home/WhyJoyzenBadge'
import IntegrationSection from '@/components/home/IntegrationSection'
import DoctorGain from '@/components/home/DoctorGain'
import DoctorAdvantage from '@/components/home/DoctorAdvantage'
import BePart from '@/components/home/BePart'
import IntakeForm from '@/components/home/IntakeForm'

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
