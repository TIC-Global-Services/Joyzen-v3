"use client"
import React from 'react'
import Image from 'next/image'

// Importing existing assets to use as background images
import img1 from '@/assets/home/betterfordoctors/focusMore.png'
import img2 from '@/assets/home/betterfordoctors/repetitivePatient.png'
import img3 from '@/assets/home/betterfordoctors/buildStronger.png'
import img4 from '@/assets/home/betterfordoctors/improvePatient.png'

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

const BetterForDoctors = () => {
    const [activeIndex, setActiveIndex] = React.useState(0)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                if (activeIndex !== cardData.length - 1) {
                    setActiveIndex(cardData.length - 1);
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

    return (
        <section className="relative w-full pt-12 pb-8 md:pt-24 md:pb-32 px-4 md:px-12 bg-white font-satoshi overflow-hidden">
            <div className="max-w-[1440px] mx-auto">

                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-medium tracking-normal">
                        What Doctors Gain with Joyzen
                    </h2>
                </div>

                {/* Mobile Slider */}
                <div className="sm:hidden">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 no-scrollbar scroll-smooth"
                    >
                        {cardData.map((card, idx) => (
                            <div key={`mobile-card-${idx}`} className="min-w-[280px] w-[280px] h-[320px] snap-center flex-shrink-0">
                                <div
                                    className="relative group rounded-lg border border-gray-100 bg-white hover:border-transparent transition-all duration-500 overflow-hidden flex flex-col justify-between p-8 h-full w-full"
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
                                        <h3 className="text-lg md:text-xl font-semibold text-white leading-tight">
                                            {card.title}
                                        </h3>
                                        {card.description && (
                                            <p className='font-epilogue text-base md:text-lg font-normal text-white leading-tight mt-2'>
                                                {card.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {cardData.map((_, idx) => (
                            <div
                                key={`dot-${idx}`}
                                className={`h-1 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-[#036132]' : 'w-2 bg-[#036132]/20'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Grid View */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {cardData.map((card, idx) => (
                        <div
                            key={`doctor-card-${idx}`}
                            className="relative group rounded-lg border border-gray-100 bg-white hover:border-transparent transition-all duration-500 overflow-hidden flex flex-col justify-between p-8 aspect-square w-full"
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
                                <h3 className="text-lg md:text-xl font-semibold text-white leading-tight">
                                    {card.title}
                                </h3>
                                {card.description && (
                                    <p className='font-epilogue text-base md:text-lg font-normal text-white leading-tight mt-2'>
                                        {card.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default BetterForDoctors
