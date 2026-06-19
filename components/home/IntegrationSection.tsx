"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Importing existing premium assets
import care from '@/assets/home/intergrationSection/continuouscare.png'
import records from '@/assets/home/intergrationSection/medicalrecords.png'
import followups from '@/assets/home/intergrationSection/followups.png'
import management from '@/assets/home/intergrationSection/patientmanagement.png'
import clinic from '@/assets/home/intergrationSection/morethanclinic.png'
import software from '@/assets/home/intergrationSection/healthcaresoftware.png'

const steps = [
    {
        title: "Continuous Care, Not Isolated Visits",
        description: "Joyzen connects clinics, diagnostics, follow-ups, and patient engagement into one seamless care experience.",
        image: care
    },
    {
        title: "More Than Medical Records",
        description: "From diagnostics and reports to treatment history and patient progress, Joyzen brings the complete patient journey into a single consultation view.",
        image: records
    },
    {
        title: "More Than Follow-Ups",
        description: "Joyzen helps clinics track whether patients are actually following prescribed treatments, nutrition plans, fitness goals, and care recommendations.",
        image: followups
    },
    {
        title: "More Than Patient Management",
        description: "Dedicated care coordination ensures patients stay engaged, supported, and connected throughout their healthcare journey.",
        image: management
    },
    {
        title: "More Than a Clinic",
        description: "Through the Joyzen ecosystem, clinics gain access to new patients while building stronger long-term relationships with existing ones.",
        image: clinic
    },
    {
        title: "More Than Healthcare Software",
        description: "Joyzen transforms clinics into connected healthcare systems that deliver care before, during, after, and beyond every visit.",
        image: software
    }
]

const IntegrationSection = () => {
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        setActiveStep((prev) => (prev + 1) % steps.length)
    }

    const handlePrev = () => {
        setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
    }

    // Touch handlers for mobile swipe
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) {
            handleNext()
        } else if (isRightSwipe) {
            handlePrev()
        }

        // Reset
        setTouchStart(0)
        setTouchEnd(0)
    }

    const getStackStyles = (idx: number) => {
        const distance = (idx - activeStep + steps.length) % steps.length;

        switch (distance) {
            case 0:
                return { transform: 'translate(0px, 0px) rotate(-5deg) scale(1)', zIndex: 10, opacity: 1 };
            case 1:
                return { transform: 'translate(0px, -5px) rotate(0deg) scale(0.96)', zIndex: 9, opacity: 1 };
            case 2:
                return { transform: 'translate(0px, -10px) rotate(5deg) scale(0.92)', zIndex: 8, opacity: 1 };
            case 3:
                return { transform: 'translate(0px, -15px) rotate(-5deg) scale(0.88)', zIndex: 7, opacity: 1 };
            case 4:
                return { transform: 'translate(0px, -20px) rotate(0deg) scale(0.84)', zIndex: 6, opacity: 0 };
            default:
                return { transform: 'translate(0px, -25px) rotate(5deg) scale(0.80)', zIndex: 0, opacity: 0 };
        }
    }

    return (
        <div className="w-full bg-white font-noria overflow-hidden py-16 lg:py-18">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col justify-start">

                {/* Header */}
                <div className="mb-16 lg:mb-24">
                    <h2 className="text-3xl text-center md:text-5xl lg:text-6xl font-medium tracking-normal mb-4 md:mb-6 uppercase">
                        How We Integrate With Clinics
                    </h2>
                    <p className="text-center font-satoshi text-lg md:text-2xl max-w-4xl leading-[1.3] mx-auto text-gray-800">
                        We fit into your clinic, without taking control. Your clinic continues to operate under your medical expertise. Joyzen adds the system around you
                    </p>
                </div>

                {/* 2-Column Content */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                    {/* Left Column: Carousel Controls + Image Stack */}
                    <div className="flex flex-row items-center gap-4 sm:gap-8 lg:gap-12 w-full lg:w-1/2 justify-center lg:justify-end">
                        {/* Left Arrow */}
                        <button
                            onClick={handlePrev}
                            className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-20 shadow-lg"
                            aria-label="Previous step"
                        >
                            <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
                        </button>

                        {/* Image Stack */}
                        <div
                            className="relative w-[420px] h-[540px] sm:w-[350px] sm:h-[420px] md:w-[420px] md:h-[540px] rounded-xl flex-shrink-0"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {steps.map((step, idx) => (
                                <div
                                    key={`img-${idx}`}
                                    className="absolute inset-0 transition-all duration-500 ease-out rounded-xl overflow-hidden shadow-2xl bg-white"
                                    style={getStackStyles(idx)}
                                >
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 300px, 420px"
                                        priority={idx === 0}
                                    />
                                    {/* Overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    {/* Title Overlaid */}
                                    <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-8 lg:right-8">
                                        <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-satoshi leading-tight drop-shadow-md">
                                            {step.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={handleNext}
                            className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-20 shadow-lg"
                            aria-label="Next step"
                        >
                            <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                    </div>

                    {/* Right Column: Description */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start px-4 lg:px-0 lg:pl-10 min-h-[150px] md:min-h-[200px]">
                        <div className="relative w-full max-w-xl">
                            {steps.map((step, idx) => (
                                <p
                                    key={`desc-${idx}`}
                                    className={`text-center font-satoshi text-xl sm:text-2xl md:text-4xl font-normal leading-snug transition-all duration-500 ease-in-out ${activeStep === idx
                                        ? 'opacity-100 blur-0 translate-y-0 static'
                                        : 'opacity-0 blur-md translate-y-4 absolute top-0 left-0 right-0 pointer-events-none'
                                        }`}
                                >
                                    {step.description}
                                </p>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default IntegrationSection
