import React from 'react'
import banner from '@/assets/home/home_hero_banner.png'
import Hero from '@/reUseable/Hero'

const HeroSection = () => {
  return (
    <div>
      <Hero
        title={
          <>
            Healthcare Was Built for Visitors.<br />We Built It for Life.
          </>
        }
        description1="Built for Life. Designed for Longevity."
        description2="For clinics ready to evolve with the future of healthcare."
        backgroundVideo='/dnaseq-2.mp4'
      />
    </div>
  )
}

export default HeroSection