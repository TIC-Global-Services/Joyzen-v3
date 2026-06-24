'use client'
import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation'
import TextReveal from '@/reUseable/TextReveal'

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

  return (
    <div className={`relative w-full min-h-screen flex items-end ${className}`}>
      {/* Background Media */}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-100">
        {backgroundVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute opacity-75 md:opacity-90 inset-0 w-full h-full object-cover object-[25%_50%]"
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
            className="object-cover object-[30%_50%]"
          />
        ) : null}
        <div className={`absolute inset-x-0 bottom-0 h-32 ${isOnlyHome ? 'bg-gradient-to-t from-white via-white/50 to-transparent' : 'bg-gradient-to-t from-white via-white/30 to-transparent'}`}></div>
      </div>
      <div className="relative w-full flex justify-start items-end px-6 md:px-12 xl:px-16 pb-10 md:pb-16 z-15">
        <div className="max-w-[1440px] mx-auto w-full flex justify-start">
          <div className={`${contentMaxWidth} ${textColorClass}`}>
            <div className="flex flex-col">
              {typeof title === 'string' ? (
                <TextReveal
                  tag="h1"
                  type="words"
                  className="text-4xl sm:text-5xl lg:text-[3.750rem] font-noria font-normal leading-[1.2] tracking-tight mb-2 drop-shadow-md uppercase max-w-[650px]"
                >
                  {title}
                </TextReveal>
              ) : (
                <h1 className="text-4xl sm:text-5xl lg:text-[3.750rem] font-noria font-normal leading-[1.2] tracking-tight mb-2 drop-shadow-md uppercase max-w-[650px]">
                  {title}
                </h1>
              )}

              {typeof description1 === 'string' && typeof description2 === 'string' ? (
                <TextReveal
                  tag="p"
                  type="words"
                  delay={0.15}
                  className="font-satoshi text-2xl md:text-4xl leading-[1.2] max-w-4xl font-normal tracking-normal text-[#EF8F60] mb-2"
                >
                  {`${description1} ${description2}`}
                </TextReveal>
              ) : (
                <p className="font-satoshi text-2xl md:text-4xl leading-[1.2] max-w-4xl font-normal tracking-normal text-[#EF8F60] mb-2">
                  {description1} <br />
                  {description2}
                </p>
              )}
            </div>

            <div className="mt-2 flex font-noria">
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
                className="group px-8 py-3 rounded-full backdrop-blur-sm border-[0.75px] border-white/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 text-sm md:text-base font-medium hover:border-[#036132]/30 active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-fit"
              >
                Apply to partner with Joyzen
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        !isOnlyHome && (
          <div className="absolute inset-x-0 top-0 h-full z-11 bg-gradient-to-b from-black/50 via-black/25 to-transparent"></div>
        )
      }
    </div >
  )
}

export default Hero
