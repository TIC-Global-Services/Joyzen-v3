"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/reUseable/TextReveal'

import biggestChallenge from '@/assets/home/caretimeline/biggestChallenge.webp'
import impact from '@/assets/home/caretimeline/impactClinic.webp'
import connected from '@/assets/home/caretimeline/connectedHealthcare.webp'
import future from '@/assets/home/caretimeline/healthFuture.webp'

const timelineSteps = [
    {
        title: "Healthcare's Biggest Challenge",
        description: "Patients move through disconnected systems, creating inefficiencies and gaps in care.",
        image: biggestChallenge,
    },
    {
        title: "The Impact on Clinics",
        description: "Doctors work harder. Teams work longer. Growth and outcomes remain a challenge.",
        image: impact,
    },
    {
        title: "A Connected Healthcare Ecosystem",
        description: "Joyzen advances reproductive health through continuous care.",
        image: connected,
    },
    {
        title: "The Future of Healthcare",
        description: "Technology, diagnostics, and care, connected in one ecosystem.",
        image: future,
    }
]

const ChallengeHealthcare = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const sectionRef = useRef<HTMLDivElement>(null)
    const split1Ref = useRef<HTMLDivElement>(null)
    const split2Ref = useRef<HTMLDivElement>(null)
    const split3Ref = useRef<HTMLDivElement>(null)
    const split4Ref = useRef<HTMLDivElement>(null)
    const blob1Ref = useRef<HTMLDivElement>(null)
    const blob2Ref = useRef<HTMLDivElement>(null)
    const blob3Ref = useRef<HTMLDivElement>(null)
    const blob4Ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        let currentIndex = 0;

        const ctx = gsap.context(() => {
            const isMobile = window.innerWidth < 768;
            const scrollDistance = isMobile ? '+=120%' : '+=300%';

            // Scroll Pinning Logic
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top", // pin when the section hits the top of viewport
                end: scrollDistance, // Shorter scroll distance on mobile
                pin: true,
                scrub: true,
                anticipatePin: 1,
                snap: {
                    snapTo: 1 / (timelineSteps.length - 1), // Snap to each card
                    duration: { min: 0.2, max: 0.5 },
                    delay: 0.05,
                    ease: "power1.inOut"
                },
                onUpdate: (self) => {
                    const numCards = timelineSteps.length;
                    const newIndex = Math.min(numCards - 1, Math.round(self.progress * (numCards - 1)));
                    if (newIndex !== currentIndex) {
                        currentIndex = newIndex;
                        setActiveIndex(newIndex);
                    }
                }
            });



        });

        return () => {
            ctx.revert(); // This safely cleans up the ScrollTrigger, mouse event, and animations
        }
    }, [])

    return (
        <section ref={sectionRef} className="relative w-full h-screen px-6 md:px-12 xl:px-16 font-noria overflow-hidden flex items-center bg-transparent md:bg-gradient-to-b md:from-white md:to-[#f7f4ed]/80">

            {/* Optimized Static Ambient Gradient for Mobile (No heavy filters or blend modes to ensure 60fps scrolling) */}
            <div
                className="absolute inset-0 w-full h-full -z-10 pointer-events-none md:hidden"
                style={{
                    background: `
                        radial-gradient(circle at 5% 95%, rgba(248, 231, 128, 0.35) 0%, transparent 55%),
                        radial-gradient(circle at 35% 90%, rgba(239, 143, 96, 0.22) 0%, transparent 45%),
                        radial-gradient(circle at 65% 90%, rgba(221, 196, 223, 0.22) 0%, transparent 45%),
                        radial-gradient(circle at 95% 95%, rgba(180, 222, 247, 0.35) 0%, transparent 55%),
                        linear-gradient(to bottom, #ffffff 0%, #f7f4ed 100%)
                    `
                }}
            />

            {/* Interactive Mesh Gradient Background restricted to bottom area (Desktop Only for GPU optimization) */}
            <div className="hidden md:flex absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden items-end">
                <div className="relative w-full h-[20vh] opacity-100 mix-blend-multiply">
                    {/* Light Yellow (Left) */}
                    <div ref={split1Ref} className="absolute inset-0">
                        <div className="absolute top-[50%] -translate-y-1/2 left-[-10%] w-[50vw] h-[42vw]"><div ref={blob1Ref} className="w-full h-full bg-[#f8e780] rounded-full filter blur-[60px] md:blur-[100px]" /></div>
                    </div>
                    {/* Coral Orange Slim (Middle Left) */}
                    <div ref={split4Ref} className="absolute inset-0">
                        <div className="absolute top-[50%] -translate-y-1/2 left-[25%] w-[20vw] h-[10vw]"><div ref={blob4Ref} className="w-full h-full bg-[#ef8f60] rounded-full filter blur-[60px] md:blur-[100px]" /></div>
                    </div>
                    {/* Periwinkle Purple (Middle Right) */}
                    <div ref={split3Ref} className="absolute inset-0">
                        <div className="absolute top-[50%] -translate-y-1/2 right-[25%] w-[45vw] h-[5vw]"><div ref={blob3Ref} className="w-full h-full bg-[#ddc4df] rounded-full filter blur-[60px] md:blur-[100px]" /></div>
                    </div>
                    {/* Icy Blue (Right) */}
                    <div ref={split2Ref} className="absolute inset-0">
                        <div className="absolute top-[50%] -translate-y-1/2 right-[-10%] w-[30vw] h-[35vw]"><div ref={blob2Ref} className="w-full h-full bg-[#b4def7] rounded-full filter blur-[60px] md:blur-[100px]" /></div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row justify-between items-center relative z-10 gap-12 lg:gap-16 pr-0 lg:pr-12">

                {/* Left Column: Header */}
                <div className="w-full lg:w-[50%] xl:w-[42%] mt-8">
                    <TextReveal
                        tag="h2"
                        type="words"
                        className="text-2xl md:text-4xl font-medium leading-[1.2] uppercase tracking-tight text-black"
                    >
                        The challenge in healthcare is no longer medical expertise. It's fragmentation.
                    </TextReveal>
                </div>

                {/* Right Column: Accordion */}
                <div className="w-full lg:w-[50%] xl:w-[45%] max-w-[480px] flex flex-col gap-3 md:gap-4 lg:ml-auto py-2 md:py-12">
                    {timelineSteps.map((step, idx) => {
                        const isActive = activeIndex === idx;

                        return (
                            <div
                                key={`care-timeline-${idx}`}
                                onClick={() => setActiveIndex(idx)}
                                className={`relative cursor-pointer transition-[height,border-radius,background-color,box-shadow] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden shadow-[8px_8px_20px_rgba(0,0,0,0.04)] ${isActive
                                    ? 'h-[280px] sm:h-[340px] md:h-[380px] rounded-[2rem]' // Active: approx 5:4 aspect ratio for 480px max width
                                    : 'h-[64px] md:h-[76px] rounded-[1.5rem] bg-gradient-to-br from-white/90 to-white/80 md:from-white/40 md:to-white/10 md:backdrop-blur-xl hover:from-white/95 hover:to-white/90 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.06)]'
                                    }`}
                            >
                                {/* Light Edge & Vignette Overlay */}
                                <div className={`absolute inset-0 pointer-events-none shadow-[inset_1.5px_1.5px_0px_rgba(255,255,255,0.9),inset_8px_8px_24px_rgba(0,0,0,0.06)] z-20 transition-[border-radius] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? 'rounded-[2rem]' : 'rounded-[1.5rem]'}`} />
                                {/* Active State Background Image */}
                                <div
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Dark gradient for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                {/* Seamless Transition Text Wrapper */}
                                <div
                                    className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-end px-6 md:px-10 z-10 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive
                                        ? 'pb-6 md:pb-8'
                                        : 'pb-[18px] md:pb-[22px]'
                                        }`}
                                >
                                    <h3
                                        className={`font-medium tracking-tight text-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? 'text-white text-lg md:text-2xl mb-2' : 'text-black text-lg md:text-2xl mb-0'
                                            }`}
                                    >
                                        {step.title}
                                    </h3>
                                    <div
                                        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isActive ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <p className="text-white/90 text-base md:text-xl font-satoshi max-w-2xl leading-tight tracking-tight text-center">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>

            </div>

            {/* Bottom White Blend Gradient to transition into WhyJoyzenBadge */}
            <div
                className="absolute bottom-0 left-0 w-full h-[150px] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)'
                }}
            />
        </section>
    )
}

export default ChallengeHealthcare
