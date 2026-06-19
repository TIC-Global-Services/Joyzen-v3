"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const WhyJoyzenBadge = () => {
    const svgRef = useRef<SVGSVGElement>(null)

    const totalTicks = 120
    const rStart = 260
    const rEnd = 290

    // Compute tick coordinates dynamically and round to 3 decimal places to prevent SSR hydration mismatches
    const ticks = Array.from({ length: totalTicks }).map((_, i) => {
        const angle = (i * 360 / totalTicks) * (Math.PI / 180)
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const round = (num: number) => Math.round(num * 1000) / 1000
        return {
            x1: round(300 + rStart * cos),
            y1: round(300 + rStart * sin),
            x2: round(300 + rEnd * cos),
            y2: round(300 + rEnd * sin),
        }
    })

    useEffect(() => {
        if (!svgRef.current) return
        const lines = svgRef.current.querySelectorAll('.tick-line')

        gsap.killTweensOf(lines)

        // Sweeping loader animation - waves of green light around the circle
        gsap.fromTo(lines,
            { stroke: "#D1D5DB", opacity: 0.15 },
            {
                stroke: "#036132",
                opacity: 0.90,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                stagger: {
                    each: 2.0 / totalTicks,
                    repeat: -1,
                    yoyo: true
                },
                ease: "power1.inOut"
            }
        )

        return () => {
            gsap.killTweensOf(lines)
        }
    }, [])

    return (
        <section className="relative w-full h-screen py-16 md:py-20 flex items-center justify-center bg-white font-noria overflow-hidden">

            {/* Top White Blend Gradient to transition from CareTimeline */}
            <div
                className="absolute top-0 left-0 w-full h-[150px] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)'
                }}
            />

            {/* Visual Loader & Faded Logo Container (Background Layer) */}

            {/* Foreground Content (Wider wrapper, can extend outside the loader circle) */}
            <div className="relative z-10 text-center max-w-7xl px-6 flex flex-col items-center justify-center">

                <h3 className="text-2xl md:text-6xl font-medium tracking-tight mb-4">
                    What <span className="text-[#036132]">Joyzen</span> Is
                </h3>

                <span className="text-xl md:text-lg font-satoshi tracking-tight mb-8">
                    The Infrastructure for the Future of Healthcare.
                </span>

                <p className="text-lg md:text-[32px] leading-[1.2] font-medium max-w-5xl">
                    Joyzen unifies <span className=' text-[#EF8F60]'>technology, diagnostics, wellness, and patient care </span> into one connected ecosystem, transforming fragmented healthcare into seamless, continuous care and enabling clinics to lead the future of healthcare.
                </p>

            </div>

        </section>
    )
}

export default WhyJoyzenBadge
