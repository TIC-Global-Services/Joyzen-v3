"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const WhyJoyzenBadge = () => {
    const svgRef = useRef<SVGSVGElement>(null)

    const totalTicks = 120
    const rStart = 215
    const rEnd = 245

    // Compute tick coordinates dynamically and round to 3 decimal places to prevent SSR hydration mismatches
    const ticks = Array.from({ length: totalTicks }).map((_, i) => {
        const angle = (i * 360 / totalTicks) * (Math.PI / 180)
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const round = (num: number) => Math.round(num * 1000) / 1000
        return {
            x1: round(250 + rStart * cos),
            y1: round(250 + rStart * sin),
            x2: round(250 + rEnd * cos),
            y2: round(250 + rEnd * sin),
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
        <section className="relative w-full py-16 md:py-36 mb-10 md:mb-18 flex items-center justify-center bg-white font-satoshi overflow-hidden">

            {/* Visual Loader & Faded Logo Container (Background Layer) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <div className="relative w-[480px] h-[480px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px]">

                    {/* SVG Radial Loading Animation */}
                    <svg
                        ref={svgRef}
                        viewBox="0 0 500 500"
                        className="absolute inset-0 w-full h-full z-0"
                    >
                        {ticks.map((tick, i) => (
                            <line
                                key={`tick-${i}`}
                                x1={tick.x1}
                                y1={tick.y1}
                                x2={tick.x2}
                                y2={tick.y2}
                                className="tick-line"
                                stroke="#D1D5DB"
                                strokeWidth="1.25"
                                strokeLinecap="round"
                            />
                        ))}
                    </svg>

                    {/* Faded Orange Logo Mark behind the text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[210px] sm:w-[160px] sm:h-[240px] opacity-[0.25] z-0">
                        <svg width="100%" height="100%" viewBox="0 0 134 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M55.9273 93.8987C25.6612 93.8987 5.99071 80.9128 0 57.1953L133.333 57.2785V93.8987H55.9273Z" fill="#EF8F60" />
                            <path d="M66.476 44.9891C54.1905 44.9891 43.8145 34.7734 43.8145 22.6859C43.8145 10.5984 54.1989 0 66.476 0C78.7532 0 89.5179 10.1741 89.5179 22.6859C89.5179 35.1977 78.9644 44.9891 66.476 44.9891Z" fill="#EF8F60" />
                            <path d="M0 142.727V106.106H77.406C107.672 106.106 127.343 119.092 133.333 142.81L0 142.727Z" fill="#EF8F60" />
                            <path d="M66.8573 200C54.1492 200 43.8154 189.826 43.8154 177.314C43.8154 164.802 54.3689 155.011 66.8573 155.011C79.3456 155.011 89.5104 165.226 89.5104 177.314C89.5104 189.401 79.1344 200 66.8573 200Z" fill="#EF8F60" />
                        </svg>
                    </div>

                </div>
            </div>

            {/* Foreground Content (Wider wrapper, can extend outside the loader circle) */}
            <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center justify-center">

                <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
                    What <span className="text-[#036132]">Joyzen</span> Is
                </h3>

                <span className="text-xl md:text-lg font-normal tracking-tight mb-4 font-mono">
                    Joyzen is more than technology.
                </span>

                {/* Paragraph is 32px on desktop and extends outside the loader circle */}
                <p className="text-xl md:text-[32px] leading-[1.2] font-medium max-w-4xl">
                    It is a healthcare ecosystem built around your practice. By integrating technology, patient engagement, care coordination, diagnostics, and operational support, we help clinics transform fragmented healthcare journeys into connected care experiences. The result is better efficiency, stronger patient relationships, and improved long-term outcomes. You bring the expertise. Joyzen provides the system that helps it scale.
                </p>

            </div>

        </section>
    )
}

export default WhyJoyzenBadge
