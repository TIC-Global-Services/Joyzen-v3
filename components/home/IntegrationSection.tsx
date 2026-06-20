"use client"
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import TextReveal from '@/reUseable/TextReveal'

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
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleNext = () => {
        setActiveStep((prev) => (prev + 1) % steps.length)
    }

    const handlePrev = () => {
        setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
    }

    // Interactive Drag / Swipe State and Handlers
    const activeCardRef = useRef<HTMLDivElement | null>(null);
    const startX = useRef(0);
    const startY = useRef(0);
    const currentX = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);
    const dragDirection = useRef<'none' | 'horizontal' | 'vertical'>('none');

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        // Prevent default browser dragging of images on desktop mouse clicks
        if (e.type === 'mousedown') {
            e.preventDefault();
        }

        isDragging.current = true;
        dragDirection.current = e.type === 'mousedown' ? 'horizontal' : 'none';

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        startX.current = clientX;
        startY.current = clientY;
        currentX.current = clientX;
        currentY.current = clientY;

        activeCardRef.current = e.currentTarget;

        // Temporarily disable the CSS transition to make dragging feel instant
        activeCardRef.current.style.transition = 'none';

        // Add listeners to window to track dragging globally
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('touchend', handleDragEnd);
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging.current || !activeCardRef.current) return;

        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

        currentX.current = clientX;
        currentY.current = clientY;

        const deltaX = clientX - startX.current;
        const deltaY = clientY - startY.current;

        if (dragDirection.current === 'none') {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);
            if (absX > 5 || absY > 5) {
                if (absX > absY) {
                    dragDirection.current = 'horizontal';
                } else {
                    dragDirection.current = 'vertical';
                    // Cancel card dragging immediately, allow normal native scroll
                    isDragging.current = false;
                    const card = activeCardRef.current;
                    activeCardRef.current = null;
                    card.style.transition = '';
                    gsap.to(card, {
                        x: 0,
                        y: 0,
                        rotation: -5,
                        scale: 1,
                        duration: 0.2,
                        overwrite: "auto"
                    });
                    // Clean up window event listeners
                    window.removeEventListener('mousemove', handleDragMove);
                    window.removeEventListener('mouseup', handleDragEnd);
                    window.removeEventListener('touchmove', handleDragMove);
                    window.removeEventListener('touchend', handleDragEnd);
                    return;
                }
            } else {
                // If movement is very tiny, don't determine direction yet
                return;
            }
        }

        if (dragDirection.current === 'vertical') {
            return;
        }

        // Prevent default viewport scrolling for horizontal card swipes
        if (e.cancelable) {
            e.preventDefault();
        }

        // Calculate rotation based on deltaX (Tinder card tilting effect)
        const rotation = -5 + (deltaX * 0.08);

        // Set card position using GSAP (fast and smooth)
        gsap.set(activeCardRef.current, {
            x: deltaX,
            y: deltaY,
            rotation: rotation,
            scale: 1.02, // slightly grow while dragging
            overwrite: "auto"
        });
    };

    const handleDragEnd = () => {
        if (!isDragging.current || !activeCardRef.current) return;

        isDragging.current = false;

        const deltaX = currentX.current - startX.current;
        const card = activeCardRef.current;
        activeCardRef.current = null;

        // Remove window listeners
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);

        // Threshold to trigger swipe (100px)
        const threshold = 100;

        if (deltaX > threshold) {
            // Swipe Right: Fly off to the right, then trigger handleNext
            gsap.to(card, {
                x: window.innerWidth + 200,
                rotation: 30,
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(card, { x: 0, y: 0, rotation: -5, opacity: 1, scale: 1 });
                    card.style.transition = ''; // restore CSS transitions
                    handleNext();
                }
            });
        } else if (deltaX < -threshold) {
            // Swipe Left: Fly off the left, then trigger handleNext
            gsap.to(card, {
                x: -window.innerWidth - 200,
                rotation: -30,
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(card, { x: 0, y: 0, rotation: -5, opacity: 1, scale: 1 });
                    card.style.transition = ''; // restore CSS transitions
                    handleNext();
                }
            });
        } else {
            // Spring back to center
            card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // custom elastic bounce
            gsap.to(card, {
                x: 0,
                y: 0,
                rotation: -5,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    card.style.transition = ''; // restore CSS transitions
                }
            });
        }
    };

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
        <div className="w-full bg-white font-noria overflow-hidden py-8 lg:py-18">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col justify-start">

                {/* Header */}
                <div className="mb-16 lg:mb-24 flex flex-col items-center justify-center">
                    <TextReveal
                        tag="h2"
                        type="words"
                        className="text-3xl text-center md:text-5xl lg:text-6xl font-medium tracking-normal mb-4 md:mb-6 uppercase justify-center"
                    >
                        How We Integrate With Clinics
                    </TextReveal>
                    <TextReveal
                        tag="p"
                        type="words"
                        delay={0.15}
                        className="text-center font-satoshi text-lg md:text-2xl max-w-4xl leading-[1.2] mx-auto text-gray-800 justify-center"
                    >
                        We fit into your clinic, without taking control. Your clinic continues to operate under your medical expertise. Joyzen adds the system around you
                    </TextReveal>
                </div>

                {/* 2-Column Content */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                    {/* Left Column: Carousel Controls + Image Stack */}
                    <div className="flex flex-row items-center gap-4 sm:gap-8 lg:gap-12 w-full lg:w-1/2 justify-center lg:justify-end">
                        {/* Left Arrow */}
                        <button
                            onClick={handlePrev}
                            className="hidden sm:flex flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-full items-center justify-center hover:bg-gray-800 transition-colors z-20 shadow-lg"
                            aria-label="Previous step"
                        >
                            <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
                        </button>

                        {/* Image Stack */}
                        <div className="relative w-[280px] h-[360px] sm:w-[320px] sm:h-[400px] md:w-[400px] md:h-[520px] rounded-xl flex-shrink-0">
                            {steps.map((step, idx) => (
                                <div
                                    key={`img-${idx}`}
                                    className={`absolute inset-0 transition-all duration-500 ease-out rounded-xl overflow-hidden shadow-2xl bg-white select-none ${idx === activeStep ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                    style={getStackStyles(idx)}
                                    onMouseDown={mounted && idx === activeStep ? handleDragStart : undefined}
                                    onTouchStart={mounted && idx === activeStep ? handleDragStart : undefined}
                                >
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover pointer-events-none"
                                        sizes="(max-width: 768px) 300px, 420px"
                                        priority={idx === 0}
                                    />
                                    {/* Overlay for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                    {/* Title Overlaid */}
                                    <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-8 lg:right-8 pointer-events-none">
                                        <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-satoshi leading-[1.2] drop-shadow-md">
                                            {step.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={handleNext}
                            className="hidden sm:flex flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-full items-center justify-center hover:bg-gray-800 transition-colors z-20 shadow-lg"
                            aria-label="Next step"
                        >
                            <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                    </div>

                    {/* Right Column: Description */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start px-4 lg:px-0 lg:pl-10 min-h-[150px] md:min-h-[200px]">
                        <div className="relative w-full max-w-xl">
                            <TextReveal
                                key={`desc-${activeStep}`}
                                tag="p"
                                type="words"
                                className="text-center lg:text-left font-satoshi text-xl sm:text-2xl md:text-4xl font-normal leading-[1.2]"
                            >
                                {steps[activeStep].description}
                            </TextReveal>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default IntegrationSection
