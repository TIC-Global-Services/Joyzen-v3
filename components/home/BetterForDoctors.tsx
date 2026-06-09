"use client"
import React, { useRef } from 'react'
import Image from 'next/image'

// Importing existing assets to use as background images
import img1 from '@/assets/home/betterfordoctors/focusMore.png'
import img2 from '@/assets/home/betterfordoctors/repetitivePatient.png'
import img3 from '@/assets/home/betterfordoctors/buildStronger.png'
import img4 from '@/assets/home/betterfordoctors/improvePatient.png'
import img5 from '@/assets/home/betterfordoctors/offerStructure.png'
import img6 from '@/assets/home/betterfordoctors/deliverCare.png'
import img7 from '@/assets/home/betterfordoctors/growBeyond.png'

const cardData = [
    {
        num: "01",
        title: "Focus more on diagnosis and clinical decisions",
        image: img1
    },
    {
        num: "02",
        title: "Reduce repetitive patient handling",
        image: img2
    },
    {
        num: "03",
        title: "Build stronger patient trust",
        image: img3
    },
    {
        num: "04",
        title: "Improve patient adherence",
        image: img4
    },
    {
        num: "05",
        title: "Streamline daily clinic operations",
        image: img5
    },
    {
        num: "06",
        title: "Continuous care and follow-ups",
        image: img6
    },
    {
        num: "07",
        title: "Expand professional brand and reach",
        image: img7
    }
]

const BetterForDoctors = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollAmount = container.clientWidth * 0.75
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollAmount = container.clientWidth * 0.75
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <section className="relative w-full pt-12 pb-8 md:pt-36 md:pb-20 px-4 md:px-12 bg-white font-satoshi overflow-hidden">
            <div className="max-w-[1440px] mx-auto">

                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-medium tracking-normal">
                        Why This Is Better For Doctors
                    </h2>
                    <p className="font-epilogue text-xl md:text-2xl leading-tight mt-4">
                        More time. Better structure. Stronger outcomes.
                    </p>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-2 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth w-full"
                >
                    {cardData.map((card, idx) => (
                        <div
                            key={`doctor-card-${idx}`}
                            className="relative group rounded-lg border border-gray-100 bg-white hover:border-transparent transition-all duration-500 overflow-hidden flex flex-col justify-between p-8 aspect-[4/4] w-[260px] sm:w-[290px] md:w-[340px] lg:w-[360px] snap-start flex-shrink-0"
                            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }}
                        >
                            {/* Background Image */}
                            <div 
                                className="absolute inset-0 z-0 pointer-events-none"
                                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }}
                            >
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }}
                                />
                                {/* Dark Overlay for Text Legibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-black/10 transition-colors duration-700" />
                            </div>

                            {/* Top Left: Card Number */}
                            <div className="relative z-10 self-start">
                                <span className="text-4xl font-medium text-white font-mono">
                                    {card.num}
                                </span>
                            </div>

                            {/* Bottom: Text Content */}
                            <div className="relative z-10 mt-auto">
                                <h3 className="font-epilogue text-lg md:text-xl font-medium text-white leading-tight">
                                    {card.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel Controls */}
                <div className="flex justify-end gap-4 mt-6 md:mt-8">
                    <button
                        onClick={scrollLeft}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A1A] text-white hover:bg-[#036132] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A1A] text-white hover:bg-[#036132] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>


            </div>
        </section>
    )
}

export default BetterForDoctors
