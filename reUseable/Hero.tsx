'use client'
import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation'

interface HeroProps {
  title: React.ReactNode;
  description1: React.ReactNode;
  description2: React.ReactNode;
  backgroundImage?: StaticImageData;
  backgroundVideo?: string;
  className?: string;
  contentMaxWidth?: string;
}

const Hero = ({
  title,
  description1,
  description2,
  backgroundImage,
  backgroundVideo,
  className = "",
  contentMaxWidth = "max-w-5xl"
}: HeroProps) => {
  const pathname = usePathname()
  const isOnlyHome = pathname === '/'
  const textColorClass = isOnlyHome ? 'text-black' : 'text-white'
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div className={`relative w-full min-h-screen flex items-end ${className}`}>
      {/* Background Media */}
      <div className={`absolute inset-0 z-10 overflow-hidden transition-all duration-700 ease-in-out ${isHovered ? 'opacity-40' : 'opacity-100'}`}>
        {backgroundVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={typeof title === 'string' ? title : "Hero background"}
            fill
            priority
            className="object-cover"
          />
        ) : null}
        <div className={`absolute inset-x-0 bottom-0 h-32 ${isOnlyHome ? 'bg-gradient-to-t from-white via-white/50 to-transparent' : 'bg-gradient-to-t from-white via-white/30 to-transparent'}`}></div>
      </div>
      <div className="relative w-full flex justify-start items-end px-6 md:px-12 xl:px-16 pb-16 md:pb-32 z-15">
        <div className="max-w-[1440px] mx-auto w-full flex justify-start">
          <div className={`${contentMaxWidth} ${textColorClass}`}>
            <div
              onMouseLeave={() => setIsHovered(false)}
              className="flex flex-col"
            >
              <h1
                onMouseEnter={() => setIsHovered(true)}
                className={`text-4xl sm:text-5xl lg:text-[3.750rem] font-epilogue font-normal md:font-normal leading-[1.1] tracking-normal mb-6 drop-shadow-md cursor-pointer transition-all duration-700 ease-in-out ${isHovered ? '-translate-y-3' : 'translate-y-0'}`}
              >
                {title}
              </h1>

              <div
                className={`transition-all duration-700 ease-in-out overflow-hidden ${isHovered ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                  }`}
              >
                <p className={`font-epilogue text-lg sm:text-xl lg:text-xl leading-[1.2] max-w-4xl font-normal tracking-normal ${textColorClass} opacity-85`}>
                  The future of healthcare is not isolated treatment. It is connected, continuous, and designed around long-term human health. Joyzen is building an integrated healthcare ecosystem where doctors, technology, diagnostics, wellness, and patient care work together seamlessly, beyond the walls of a clinic. Designed to support every specialty and every stage of life, Joyzen enables modern healthcare experiences focused on prevention, recovery, longevity, and lifelong wellbeing.
                </p>
              </div>
            </div>

            <div className="text-lg sm:text-xl font-epilogue lg:text-xl font-normal drop-shadow-md leading-[1.1] tracking-normal whitespace-pre-wrap">
              {description1}
              <br />
              {description2}
            </div>
            <div className="mt-8 flex">
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && (window as any).lenis) {
                    (window as any).lenis.scrollTo('#intake-form');
                  } else {
                    const formElement = document.getElementById('intake-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="group bg-[#1A1A1A] text-white hover:bg-[#036132] transition-all duration-300 tracking-tight px-6 py-3 rounded-[2.625rem] font-medium shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-fit"
              >
                Apply to partner with Joyzen
              </button>
            </div>
          </div>
        </div>
      </div>
      {!isOnlyHome && (
        <div className="absolute inset-x-0 top-0 h-full z-11 bg-gradient-to-b from-black/50 via-black/25 to-transparent"></div>
      )}
    </div>
  )
}

export default Hero
