"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import biggestChallenge from '@/assets/home/caretimeline/biggestChallenge.png'
import impact from '@/assets/home/caretimeline/impactClinic.png'
import connected from '@/assets/home/caretimeline/connectedHealthcare.png'
import future from '@/assets/home/caretimeline/healthFuture.png'

const timelineSteps = [
    {
        title: "Healthcare's Biggest Challenge",
        description: "The challenge in healthcare is no longer medical expertise, it's fragmentation. Patients move between consultations, diagnostics, treatments, follow-ups, and wellness support through disconnected systems that create inefficiencies and gaps in care.",
        image: biggestChallenge,
        alignLeft: true,
    },
    {
        title: "The Impact on Clinics",
        description: "Doctors work harder. Teams work longer. Yet sustainable growth and better patient outcomes remain difficult to achieve.",
        image: impact,
        alignLeft: false,
    },
    {
        title: "A Connected Healthcare Ecosystem",
        description: "The future of healthcare requires more than great medicine. It requires a connected system. Joyzen helps clinics integrate technology, patient engagement, care coordination, diagnostics, and operational support into one seamless healthcare ecosystem.",
        image: connected,
        alignLeft: true,
    },
    {
        title: "A New Health System for the Future",
        description: "Joyzen is building an integrated healthcare ecosystem where doctors, technology, diagnostics, wellness, and patient care work together seamlessly to support prevention, recovery, longevity, and long-term wellbeing.",
        image: future,
        alignLeft: false,
    }
]

const CareTimeline = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const lineProgressRef = useRef<HTMLDivElement>(null)
    const stepsRef = useRef<HTMLDivElement[]>([])

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current || !lineProgressRef.current) return;

        // Progress bar scroll trigger
        gsap.fromTo(lineProgressRef.current,
            { height: "0%" },
            {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 25%",
                    end: "bottom 75%",
                    scrub: true,
                }
            }
        );

        // Step cards fade/slide in
        stepsRef.current.forEach((step, index) => {
            if (!step) return;

            const textBlock = step.querySelector('.step-text');
            const imageBlock = step.querySelector('.step-image');
            const nodeBlock = step.querySelector('.step-node');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: step,
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 0.5,
                }
            });

            // Animate text block sliding in
            tl.fromTo(textBlock,
                { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
                { opacity: 1, x: 0, duration: 1 },
                0
            );

            // Animate image block sliding in
            tl.fromTo(imageBlock,
                { opacity: 0, x: index % 2 === 0 ? 40 : -40 },
                { opacity: 1, x: 0, duration: 1 },
                0
            );

            // Animate central circle/node pulsing/activating
            tl.fromTo(nodeBlock,
                { scale: 0.5, backgroundColor: "#E5E7EB" },
                { scale: 1.2, backgroundColor: "#036132", duration: 0.5 },
                0
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <section ref={containerRef} className="relative w-full py-16 md:py-36 px-4 md:px-12 bg-white font-satoshi overflow-hidden">
            <div className="max-w-[1440px] mx-auto relative">

                {/* Header */}
                <div className="text-center mb-24 md:mb-32">

                    <h2 className="text-2xl md:text-5xl font-medium tracking-tight text-[#1A1A1A] max-w-5xl mx-auto leading-tight">
                        The Challenge in healthcare is no longer medical expertise. It's fragmentation
                    </h2>
                </div>

                {/* Vertical Timeline Central Line */}
                <div className="absolute left-1/2 top-[220px] bottom-10 w-[2px] bg-gray-200 -translate-x-1/2 hidden md:block">
                    <div
                        ref={lineProgressRef}
                        className="absolute top-0 left-0 w-full bg-[#EF8F60] origin-top"
                        style={{ height: "0%" }}
                    />
                </div>

                {/* Steps */}
                <div className="space-y-24 md:space-y-36 relative z-10">
                    {timelineSteps.map((step, idx) => (
                        <div
                            key={`step-${idx}`}
                            ref={el => { if (el) stepsRef.current[idx] = el; }}
                            className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 w-full ${step.alignLeft ? '' : 'md:flex-row-reverse'
                                }`}
                        >
                            {/* Text Column */}
                            <div className="w-full md:w-[42%] step-text flex flex-col justify-center">
                                <h3 className="text-xl md:text-3xl font-medium mb-4">
                                    {idx + 1}. {step.title}
                                </h3>
                                <p className="text-base md:text-2xl leading-tight tracking-tight font-normal">
                                    {step.description}
                                </p>
                            </div>

                            {/* Center Node / Circle */}
                            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-20">
                                <div className="step-node w-4 h-4 rounded-full bg-gray-200 transition-all duration-300 shadow-md" />
                            </div>

                            {/* Image Column */}
                            <div className="w-full md:w-[38%] step-image relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 38vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default CareTimeline
