'use client'
import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation'

interface HeroProps {
  title: string;
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

  return (
    <div className={`relative w-full min-h-screen flex items-end ${className}`}>
      {/* Background Media */}
      <div className="absolute inset-0 z-10 overflow-hidden">
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
            alt={title || "Hero background"}
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
            <h1 className="text-4xl sm:text-5xl lg:text-[3.750rem] font-epilogue font-normal md:font-medium leading-[1.1] tracking-tight mb-6 drop-shadow-md">
              {title}
            </h1>
            <div className="text-lg sm:text-xl font-epilogue lg:text-xl font-normal drop-shadow-md leading-[1.1] tracking-tight whitespace-pre-wrap">
              {description1}
              <br />
              {description2}
            </div>
            <div className="mt-8 flex">
              <button
                onClick={() => {
                  const formElement = document.getElementById('intake-form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3 rounded-[2.625rem] backdrop-blur-xs shadow-md font-satoshi font-medium transition-all duration-300 bg-[#FFFFFFCC] hover:bg-[#F9F9F9] text-black hover:scale-105 active:scale-95 cursor-pointer text-center"
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
