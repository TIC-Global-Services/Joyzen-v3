"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import bePart1 from '@/assets/home/joinwaitlist/bePart1.png'
import bePart2 from '@/assets/home/joinwaitlist/bePart2.png'

const JoinWaitlistCTA = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const leftHandRef = useRef<HTMLDivElement>(null)
    const rightHandRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current) return;

        // Slide left hand from off-screen left to the left edge of the viewport
        if (leftHandRef.current) {
            gsap.fromTo(leftHandRef.current,
                { xPercent: -150, opacity: 0 },
                {
                    xPercent: 0,
                    opacity: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 65%",
                        end: "top 25%",
                        scrub: 1,
                    }
                }
            );
        }

        // Slide right hand from off-screen right to the right edge of the viewport
        if (rightHandRef.current) {
            gsap.fromTo(rightHandRef.current,
                { xPercent: 150, opacity: 0 },
                {
                    xPercent: 0,
                    opacity: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 65%",
                        end: "top 25%",
                        scrub: 1,
                    }
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <section ref={containerRef} id="waitlist" className="relative w-full pt-24 pb-16 md:pt-48 md:pb-36 bg-white font-satoshi overflow-hidden">

            {/* Background Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(239,143,96,0.08)_0%,transparent_70%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(3,97,50,0.05)_0%,transparent_80%)]" />
            </div>

            {/* Left Hand Image - Placed relative to full section viewport edge */}
            <div ref={leftHandRef} className="absolute left-0 top-[-30px] lg:top-[-120px] w-[180px] h-[130px] md:w-[350px] md:h-[240px] lg:w-[520px] xl:w-[700px] lg:h-[350px] xl:h-[460px] pointer-events-none z-0 lg:z-20 opacity-60 lg:opacity-100 z-20">
                <Image
                    src={bePart1}
                    alt="Join Joyzen - Left Hand"
                    fill
                    className="object-contain object-left-top"
                    sizes="(max-width: 768px) 180px, (max-width: 1024px) 350px, 700px"
                    priority
                />
            </div>

            {/* Right Hand Image - Placed relative to full section viewport edge */}
            <div ref={rightHandRef} className="absolute right-0 bottom-[50px] lg:bottom-[20px] w-[180px] h-[130px] md:w-[350px] md:h-[240px] lg:w-[520px] xl:w-[700px] lg:h-[350px] xl:h-[460px] pointer-events-none z-0 lg:z-20 opacity-60 lg:opacity-100">
                <Image
                    src={bePart2}
                    alt="Join Joyzen - Right Hand"
                    fill
                    className="object-contain object-right-bottom"
                    sizes="(max-width: 768px) 180px, (max-width: 1024px) 350px, 700px"
                    priority
                />
            </div>

            <div className="max-w-[1440px] mx-auto px-6 relative flex items-center justify-between">

                {/* Central Content */}
                <div className="w-full max-w-4xl mx-auto text-center z-10 flex flex-col items-center justify-center">
                    <h1 className="text-2xl md:text-6xl font-medium tracking-tight text-[#1A1A1A] leading-tight mb-8 max-w-5xl">
                        Be part of what comes next.
                    </h1>

                    <p className="text-base md:text-[32px] leading-tight font-normal mb-12 max-w-5xl">
                        Joyzen helps doctors grow beyond clinical consultations by building their personal brand in reproductive health, increasing visibility, and strengthening long-term patient trust. Through education, awareness, and continuous engagement, doctors can become recognized voices in reproductive health, not just clinic practitioners.
                    </p>

                    <button
                        onClick={() => {
                            const formElement = document.getElementById('intake-form');
                            if (formElement) {
                                formElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="group text-[12px] md:text-[17px] bg-[#1A1A1A] text-white hover:bg-[#036132] transition-all duration-300 tracking-tight px-12 py-4 rounded-full font-medium shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
                        style={{ paddingTop: '16px', paddingBottom: '16px' }}
                    >
                        Join Now
                        <span className="inline-block transition-transform group-hover:translate-x-1 duration-300">→</span>
                    </button>
                </div>

            </div>
        </section>
    )
}

export default JoinWaitlistCTA
