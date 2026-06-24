"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/reUseable/TextReveal'

// Importing existing assets to use as background images
import img1 from '@/assets/home/betterfordoctors/01.webp'
import img2 from '@/assets/home/betterfordoctors/02.webp'
import img3 from '@/assets/home/betterfordoctors/03.webp'
import img4 from '@/assets/home/betterfordoctors/04.webp'

const cardData = [
    {
        num: "01",
        title: "More Focus",
        description: "Less administration. More medicine.",
        image: img1
    },
    {
        num: "02",
        title: "More Continuity",
        description: "Care that extends beyond the clinic walls.",
        image: img2
    },
    {
        num: "03",
        title: "More Trust",
        description: "A practice built for the future of healthcare.",
        image: img3
    },
    {
        num: "04",
        title: "More Growth",
        description: "A practice built for the future of healthcare.",
        image: img4
    }
]

const DoctorGain = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        const cards = gsap.utils.toArray('.doctor-card') as HTMLElement[];

        const mm = gsap.matchMedia();

        mm.add("(min-width: 0px)", () => {
            const ctx = gsap.context(() => {
                const isMobile = window.innerWidth < 768;
                const isShortScreen = window.innerHeight < 768;

                const scrollDistance = isMobile ? '+=160%' : `+=${cards.length * 100}%`;
                const stackOffset = isMobile ? 12 : (isShortScreen ? 15 : 30);
                const pushUpOffset = isMobile ? 8 : (isShortScreen ? 10 : 20);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top", // Pin exactly when section hits top
                        end: scrollDistance, // Shorter scroll distance on mobile
                        scrub: 0.5, // Smooth scrubbing
                        pin: true,
                        anticipatePin: 1,
                        snap: {
                            snapTo: 1 / (cards.length - 1), // Snap to each card
                            duration: { min: 0.2, max: 0.5 },
                            delay: 0.05,
                            ease: "power1.inOut"
                        }
                    }
                });

                cards.forEach((card, index) => {
                    // Initial states
                    gsap.set(card, {
                        zIndex: index,
                        y: index === 0 ? 0 : "120vh", // Push subsequent cards offscreen
                        scale: 1,
                    });

                    const overlay = card.querySelector('.card-overlay');
                    if (overlay) {
                        gsap.set(overlay, { opacity: 0 });
                    }

                    if (index > 0) {
                        // Animate current card sliding up from bottom
                        tl.to(card, {
                            y: `${index * stackOffset}px`, // Slight offset for stacking effect
                            duration: 1,
                            ease: "power2.out"
                        }, index); // Timeline timing starts at 'index'

                        // Animate all previously stacked cards to scale down and add white overlay
                        for (let i = 0; i < index; i++) {
                            tl.to(cards[i], {
                                scale: 1 - ((index - i) * 0.05), // Scale down 5% per layer deep
                                y: `${(i * stackOffset) - ((index - i) * pushUpOffset)}px`, // Push up slightly as they scale
                                duration: 1,
                                ease: "power2.out"
                            }, index);

                            const overlay = cards[i].querySelector('.card-overlay');
                            if (overlay) {
                                tl.to(overlay, {
                                    opacity: (index - i) * 0.35, // Add white overlay based on depth
                                    duration: 1,
                                    ease: "power2.out"
                                }, index);
                            }
                        }
                    }
                });
            }, sectionRef);

            return () => ctx.revert();
        });

        return () => {
            mm.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen font-noria overflow-hidden flex flex-col items-center justify-center py-10 [@media(max-height:768px)]:py-4">
            <div className="max-w-[1440px] w-full mx-auto px-4 md:px-12 flex flex-col items-center justify-center h-full">

                {/* Header */}
                <div className="mb-12 md:mb-10 w-full text-center shrink-0 [@media(max-height:768px)]:mb-6 [@media(max-height:650px)]:mb-3 flex flex-col items-center justify-center">
                    <TextReveal
                        tag="h2"
                        type="words"
                        className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-normal uppercase mb-4 [@media(max-height:768px)]:text-4xl [@media(max-height:650px)]:text-3xl justify-center"
                    >
                        What Doctors Gain with Joyzen
                    </TextReveal>
                    <TextReveal
                        tag="p"
                        type="words"
                        delay={0.15}
                        className="font-satoshi text-xl md:text-3xl max-w-4xl leading-[1.2] mx-auto text-gray-800 [@media(max-height:768px)]:text-lg [@media(max-height:650px)]:text-base justify-center mb-8"
                    >
                        More time. Better structure. Stronger outcomes.
                    </TextReveal>
                </div>

                {/* Stacked Cards Container */}
                <div ref={containerRef} className="relative w-full h-[450px] sm:h-[420px] lg:h-[400px] [@media(max-height:768px)]:h-[350px] [@media(max-height:650px)]:h-[290px] max-w-[960px] mx-auto perspective-1000 shrink-0">
                    {cardData.map((card, idx) => {
                        const isEven = idx % 2 === 0;
                        const bgColor = isEven ? 'bg-[#ef8f60]' : 'bg-[#f7f4ed]';
                        // Colors are static since cards slide in and stay focused until stacked over
                        const numColor = isEven ? 'text-white' : 'text-black';
                        const titleColor = 'text-black';
                        const descColor = isEven ? 'text-white' : 'text-gray-900';

                        return (
                            <div
                                key={`doctor-card-${idx}`}
                                className={`doctor-card absolute top-0 left-0 w-full h-full rounded-[20px] overflow-hidden will-change-transform origin-top ${bgColor}`}
                            >
                                <div className="card-overlay absolute inset-0 bg-white pointer-events-none z-50 opacity-0" />
                                <div className="flex flex-col sm:flex-row h-full p-6 sm:p-8 md:p-12 gap-4 sm:gap-8 items-stretch justify-between relative z-10">
                                    {/* Left Text Side */}
                                    <div className="flex flex-col justify-center w-full sm:w-1/2 sm:p-0">
                                        <span className={`font-satoshi text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-medium leading-none mb-2 md:mb-6 ${numColor} [@media(max-height:768px)]:text-5xl [@media(max-height:650px)]:text-4xl`}>
                                            {card.num}
                                        </span>
                                        <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold uppercase mb-2 md:mb-4 ${titleColor} [@media(max-height:768px)]:text-2xl [@media(max-height:650px)]:text-xl`}>
                                            {card.title}
                                        </h3>
                                        <p className={`font-satoshi text-base sm:text-xl md:text-2xl font-normal leading-[1.2] ${descColor} [@media(max-height:768px)]:text-base [@media(max-height:650px)]:text-sm`}>
                                            {card.description}
                                        </p>
                                    </div>

                                    {/* Right Image Side */}
                                    <div className="w-full sm:w-1/2 flex-1 sm:flex-none flex items-stretch sm:items-center sm:justify-end">
                                        <div className="relative w-full h-full sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] rounded-[16px] sm:rounded-3xl overflow-hidden bg-black/10">
                                            <Image
                                                src={card.image}
                                                alt={card.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}

export default DoctorGain
