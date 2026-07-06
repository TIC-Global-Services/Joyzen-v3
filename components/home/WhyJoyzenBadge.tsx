"use client"
import React from 'react'
import Image from 'next/image'
import TextReveal from '@/reUseable/TextReveal'

const hoverImages = ['/hover/hover1.webp', '/hover/hover2.webp', '/hover/hover3.webp', '/hover/hover4.webp']
const marqueeImages = [...hoverImages, ...hoverImages]

const WhyJoyzenBadge = () => {
    return (
        <section className="relative w-full min-h-[600px] md:min-h-screen py-16 md:py-20 flex flex-col items-center justify-between bg-white font-noria overflow-hidden">

            {/* Top White Blend Gradient to transition from ChallengeHealthcare */}
            <div
                className="absolute top-0 left-0 w-full h-[150px] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)'
                }}
            />

            {/* Foreground Content */}
            <div className="relative z-10 text-center max-w-7xl px-6 flex flex-col items-center justify-center flex-1">

                <TextReveal
                    tag="h3"
                    className="text-2xl md:text-6xl font-medium tracking-tight mb-2 text-center"
                >
                    What <span className="text-[#036132]">Joyzen</span> Is
                </TextReveal>

                <TextReveal
                    tag="span"
                    delay={0.1}
                    className="text-xl md:text-2xl font-satoshi tracking-tight mb-4 text-center block"
                >
                    The Infrastructure for the Future of Healthcare.
                </TextReveal>

                <TextReveal
                    tag="p"
                    type="lines"
                    delay={0.2}
                    className="text-lg md:text-[32px] leading-[1.2] font-medium max-w-5xl text-center"
                >
                    Joyzen unifies <span className="text-[#EF8F60]">technology, diagnostics, wellness, and patient care</span> into one connected ecosystem, transforming fragmented healthcare into seamless, continuous care and enabling clinics to lead the future of healthcare.
                </TextReveal>

            </div>

            {/* Scrolling Image Marquee at the bottom */}
            <div className="w-full overflow-hidden relative z-10 mt-12 md:mt-16 select-none">
                <div className="flex w-max animate-scroll-text" style={{ animationDuration: '30s' }}>
                    {/* Group 1 */}
                    <div className="flex gap-6 pr-6">
                        {marqueeImages.map((src, idx) => (
                            <div key={idx} className="flex-shrink-0 w-[180px] h-[180px] md:w-[280px] md:h-[280px] relative rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03]">
                                <Image
                                    src={src}
                                    alt={`Joyzen Aspect ${idx + 1}`}
                                    fill
                                    loading="lazy"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Group 2 */}
                    <div className="flex gap-6 pr-6">
                        {marqueeImages.map((src, idx) => (
                            <div key={`dup-${idx}`} className="flex-shrink-0 w-[180px] h-[180px] md:w-[280px] md:h-[280px] relative rounded-2xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.03]">
                                <Image
                                    src={src}
                                    alt={`Joyzen Aspect ${idx + 1} Duplicate`}
                                    fill
                                    loading="lazy"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    )
}

export default WhyJoyzenBadge
