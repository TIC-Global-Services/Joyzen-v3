"use client"
import React from 'react'
import Image, { StaticImageData } from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import grid1 from '@/assets/home/doctorgrowthgrid/grid1.png'
import grid2 from '@/assets/home/doctorgrowthgrid/grid2.png'
import grid3 from '@/assets/home/doctorgrowthgrid/grid3.png'


interface GrowthItem {
    title: string;
    description?: string;
    image?: StaticImageData;
    isLarge?: boolean;
    maxW?: string;
    className?: string;
    customGraphic?: React.ReactNode;
}

const DoctorGrowthGrid = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const desktopCardsRef = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const section = document.getElementById('doctor-growth');
        if (!section) return;

        // We only animate desktop layout since mobile is a slider
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 10%", // Trigger animation later, when top of section reaches 30% down the viewport
                    toggleActions: "play none none reverse",
                }
            });

            desktopCardsRef.current.forEach((card, idx) => {
                if (!card) return;

                let x = "0%";
                let y = "0%";

                // X positioning: 0,3 move from right; 2,5 move from left
                if (idx === 0 || idx === 3) x = "115%";
                else if (idx === 2 || idx === 5) x = "-115%";

                // Y positioning: 0,1,2 move from bottom; 3,4,5 move from top
                if (idx === 0 || idx === 1 || idx === 2) y = "60%";
                else y = "-60%";

                tl.from(card, {
                    x: x,
                    y: y,
                    opacity: 0,
                    scale: 0.2,
                    duration: 1.2,
                    ease: "back.out(1.2)"
                }, 0); // 0 start time = explode simultaneously
            });
        });

        return () => {
            mm.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const growthItems: GrowthItem[] = [
        {
            title: "Increase visibility across the Joyzen ecosystem",
            image: grid1,
            maxW: "max-w-full",

        },
        {
            title: "Build a stronger professional presence",
            maxW: "max-w-[220px]"
        },
        {
            title: "Be recognized as a trusted expert in your field",
            image: grid2,
            maxW: "max-w-[180px]"
        },
        {
            title: "Create deeper, long-term relationships with patients",
            maxW: "max-w-[180px]"
        },
        {
            title: "Strengthen patient trust through continuous engagement",
            image: grid3,
            maxW: "max-w-[220px]"
        },
        {
            title: "Increase visibility across the Joyzen ecosystem",
            isLarge: true,
            maxW: "max-w-[320px]"
        }
    ];

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // If scrolled to the very end, force the last index
            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                if (activeIndex !== growthItems.length - 1) {
                    setActiveIndex(growthItems.length - 1);
                }
                return;
            }

            const cardWidth = 296; // 280px card + 16px gap
            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        }
    };

    const GrowthCard = ({ item, idx, isMobile, className }: { item: GrowthItem, idx: number, isMobile?: boolean, className?: string }) => {
        const aspectClass = (idx === 1 || idx === 4) ? 'aspect-[4/2.5]' : 'aspect-[4/3]';

        if (idx === 0) {
            return (
                <div className={`relative w-full ${isMobile ? 'h-[300px]' : aspectClass} rounded-2xl overflow-hidden group border border-white/60 bg-gradient-to-b from-white/75 to-white/45 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_24px_50px_rgb(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:-translate-y-1 hover:border-white/90 transition-all duration-500 ease-out flex-shrink-0 flex flex-col justify-between p-6 ${className || ''}`}>
                    {/* Scaled down inline image placed above the text */}
                    <div className="relative w-full flex-1 flex items-center justify-center p-2 mb-2">
                        <div className="relative w-[180px] h-[90px] md:w-[200px] md:h-[100px] transition-transform duration-500 group-hover:scale-103">
                            <Image
                                src={item.image!}
                                alt={item.title}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 180px, 200px"
                            />
                        </div>
                    </div>
                    {/* Text content below */}
                    <div className="relative z-20 text-[#1A1A1A]">
                        <h3 className="text-xl font-medium leading-tight tracking-tighter">
                            {item.title}
                        </h3>
                    </div>
                </div>
            );
        }

        return (
            <div className={`relative w-full ${isMobile ? 'h-[300px]' : aspectClass} rounded-2xl overflow-hidden group border border-white/60 bg-gradient-to-b from-white/75 to-white/45 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_24px_50px_rgb(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:-translate-y-1 hover:border-white/90 transition-all duration-500 ease-out flex-shrink-0 ${className || ''}`}>

                {/* Visual background */}
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 200px, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                ) : item.customGraphic ? (
                    item.customGraphic
                ) : null}

                {/* Gradient Overlay if visual background exists */}
                {item.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent z-10" />
                )}

                {/* Text Overlay */}
                <div className={`absolute bottom-0 left-0 p-6 z-20 ${item.image ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    <h3 className="text-xl font-medium mb-1 md:mb-2 leading-tight tracking-tight">
                        {item.title}
                    </h3>
                    <p className="text-xs md:text-sm opacity-90 leading-tight">
                        {item.description}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <section id="doctor-growth" className="relative pt-16 pb-12 md:pt-16 md:pb-36 px-4 md:px-14 overflow-hidden font-satoshi bg-white">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none transform-gpu">
                <div className="absolute -bottom-[5%] -left-[40%] md:left-[-50%] w-[80%] h-[40%] bg-[#b4def7]/30 rounded-[100%] md:blur-[80px]" />
                <div className="absolute -bottom-[5%] -right-[30%] w-[70%] h-[30%] bg-[#036132]/10 rounded-[100%] md:blur-[80px]" />
            </div>

            <div className="max-w-[1440px] mx-auto">

                {/* Header */}
                <div className="text-center mb-20 md:mb-28">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-4">
                        Doctor Growth & Personal Brand
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl font-normal leading-tight">
                        Doctors don't just practice medicine. They build trust, impact, and a lasting legacy
                    </p>
                </div>

                {/* Mobile Slider */}
                <div className="md:hidden">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 no-scrollbar scroll-smooth"
                    >
                        {growthItems.map((item, idx) => (
                            <div key={`mobile-${idx}`} className="min-w-[280px] w-[280px] h-[320px] snap-center">
                                <GrowthCard item={item} idx={idx} isMobile />
                            </div>
                        ))}
                    </div>
                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {growthItems.map((_, idx) => (
                            <div
                                key={`dot-${idx}`}
                                className={`h-1 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-[#036132]' : 'w-2 bg-[#036132]/20'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop View — 3-Column Layout to respect card aspect ratios */}
                <div className="hidden md:grid md:grid-cols-3 md:gap-5 relative z-10 perspective-1000">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-5">
                        <div ref={el => { if (el) desktopCardsRef.current[0] = el; }}>
                            <GrowthCard item={growthItems[0]} idx={0} />
                        </div>
                        <div ref={el => { if (el) desktopCardsRef.current[3] = el; }}>
                            <GrowthCard item={growthItems[3]} idx={3} />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col justify-between">
                        <div ref={el => { if (el) desktopCardsRef.current[1] = el; }}>
                            <GrowthCard item={growthItems[1]} idx={1} />
                        </div>

                        {/* Logo in the middle row (transparent orange SVG logo) */}
                        <div className="relative w-full flex items-center justify-center pointer-events-none py-2 z-50">
                            <div className="relative w-12 h-18 md:w-16 md:h-24 lg:w-20 lg:h-30 drop-shadow-xl bg-white/20 rounded-full p-2 backdrop-blur-sm">
                                <svg width="100%" height="100%" viewBox="0 0 134 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M55.9273 93.8987C25.6612 93.8987 5.99071 80.9128 0 57.1953L133.333 57.2785V93.8987H55.9273Z" fill="#EF8F60" />
                                    <path d="M66.476 44.9891C54.1905 44.9891 43.8145 34.7734 43.8145 22.6859C43.8145 10.5984 54.1989 0 66.476 0C78.7532 0 89.5179 10.1741 89.5179 22.6859C89.5179 35.1977 78.9644 44.9891 66.476 44.9891Z" fill="#EF8F60" />
                                    <path d="M0 142.727V106.106H77.406C107.672 106.106 127.343 119.092 133.333 142.81L0 142.727Z" fill="#EF8F60" />
                                    <path d="M66.8573 200C54.1492 200 43.8154 189.826 43.8154 177.314C43.8154 164.802 54.3689 155.011 66.8573 155.011C79.3456 155.011 89.5104 165.226 89.5104 177.314C89.5104 189.401 79.1344 200 66.8573 200Z" fill="#EF8F60" />
                                </svg>
                            </div>
                        </div>

                        <div ref={el => { if (el) desktopCardsRef.current[4] = el; }}>
                            <GrowthCard item={growthItems[4]} idx={4} />
                        </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-5">
                        <div ref={el => { if (el) desktopCardsRef.current[2] = el; }}>
                            <GrowthCard item={growthItems[2]} idx={2} />
                        </div>
                        <div ref={el => { if (el) desktopCardsRef.current[5] = el; }}>
                            <GrowthCard item={growthItems[5]} idx={5} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DoctorGrowthGrid
