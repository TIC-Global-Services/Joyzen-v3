"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import TextReveal from '@/reUseable/TextReveal'

const WhyJoyzenBadge = () => {
    const svgRef = useRef<SVGSVGElement>(null)
    const lastPos = useRef({ x: 0, y: 0 })
    const imgIndex = useRef(0)
    const hoverImages = ['/hover/hover1.png', '/hover/hover2.png', '/hover/hover3.png', '/hover/hover4.png']

    const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
        const x = e.clientX
        const y = e.clientY

        // Calculate distance from last spawned image to prevent overlapping
        const dx = x - lastPos.current.x
        const dy = y - lastPos.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Spawn image if distance is more than 50px
        if (distance > 50) {
            lastPos.current = { x, y }

            const img = document.createElement('img')
            img.src = hoverImages[imgIndex.current]
            imgIndex.current = (imgIndex.current + 1) % hoverImages.length

            // Style the trailing image
            img.style.position = 'fixed'
            img.style.left = `${x}px`
            img.style.top = `${y}px`
            img.style.width = '140px'
            img.style.height = 'auto'
            img.style.transform = 'translate(-50%, -50%) scale(0.3)'
            img.style.opacity = '0'
            img.style.pointerEvents = 'none'
            img.style.zIndex = '100'
            img.style.borderRadius = '12px'
            img.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'
            img.className = 'hover-trail-img'

            document.body.appendChild(img)

            const rotation = Math.random() * 24 - 12 // random rotation [-12deg, 12deg]
            gsap.timeline()
                .to(img, {
                    scale: 1,
                    opacity: 1,
                    rotation: rotation,
                    duration: 0.3,
                    ease: "back.out(1.2)"
                })
                .to(img, {
                    y: '-=30', // Float upwards
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        img.remove()
                    }
                }, "+=0.1")
        }
    }

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
        <section className="relative w-full h-[450px] md:h-screen py-16 md:py-10 flex items-center justify-center bg-white font-noria overflow-hidden">

            {/* Top White Blend Gradient to transition from ChallengeHealthcare */}
            <div
                className="absolute top-0 left-0 w-full h-[150px] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)'
                }}
            />

            {/* Visual Loader & Faded Logo Container (Background Layer) */}

            {/* Foreground Content (Wider wrapper, can extend outside the loader circle) */}
            <div className="relative z-10 text-center max-w-7xl px-6 flex flex-col items-center justify-center">

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
                    Joyzen unifies <span className="text-[#EF8F60] cursor-pointer transition-colors duration-300 inline" onMouseMove={handleMouseMove}>technology, diagnostics, wellness, and patient care</span> into one connected ecosystem, transforming fragmented healthcare into seamless, continuous care and enabling clinics to lead the future of healthcare.
                </TextReveal>

            </div>

        </section>
    )
}

export default WhyJoyzenBadge
