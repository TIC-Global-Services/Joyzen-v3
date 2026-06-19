import Hero from '@/components/home/Hero'
import CareTimeline from '@/components/home/CareTimeline'
import WhyJoyzenBadge from '@/components/home/WhyJoyzenBadge'
import IntegrationSection from '@/components/home/IntegrationSection'
import BetterForDoctors from '@/components/home/BetterForDoctors'
import DoctorGrowthGrid from '@/components/home/DoctorGrowthGrid'
import JoinWaitlistCTA from '@/components/home/JoinWaitlistCTA'
import IntakeForm from '@/components/home/IntakeForm'

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <CareTimeline />
      <WhyJoyzenBadge />
      <IntegrationSection />
      <BetterForDoctors />
      <DoctorGrowthGrid />
      <JoinWaitlistCTA />
      <IntakeForm />
    </main>
  );
}
