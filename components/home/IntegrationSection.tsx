"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Importing existing premium assets
import imgBefore from '@/assets/home/intergrationSection/beforeConsultation.png'
import imgDuring from '@/assets/home/intergrationSection/duringConsultation.png'
import imgAfter from '@/assets/home/intergrationSection/afterConsultation.png'
import imgBetween from '@/assets/home/intergrationSection/betweenVisits.png'

const steps = [
    {
        title: "Continuous Care, Not Isolated Visits",
        description: "Joyzen extends care beyond the consultation by connecting clinics, online care, diagnostics, follow-ups, care coordination, and patient engagement into one unified experience.",
        image: imgBefore
    },
    {
        title: "More Than Medical Records",
        description: "From diagnostics and reports to treatment history and patient progress, Joyzen brings the complete patient journey into a single consultation view.",
        image: imgDuring
    },
    {
        title: "More Than Follow-Ups",
        description: "Joyzen helps clinics track whether patients are actually following prescribed treatments, nutrition plans, fitness goals, and care recommendations.",
        image: imgAfter
    },
    {
        title: "More Than Patient Management",
        description: "Dedicated care coordination ensures patients stay engaged, supported, and connected throughout their healthcare journey.",
        image: imgBetween
    },
    {
        title: "More Than a Clinic",
        description: "Through the Joyzen ecosystem, clinics gain access to new patients while building stronger long-term relationships with existing ones.",
        image: imgBetween
    },
    {
        title: "More Than Healthcare Software",
        description: "Joyzen transforms clinics into connected healthcare systems that deliver care before, during, after, and beyond every visit.",
        image: imgBetween
    }
]

const IntegrationSection = () => {
    const pinContainerRef = useRef<HTMLDivElement>(null)
    const [activeStep, setActiveStep] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (!isMobile) return
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length)
        }, 2000)
        return () => clearInterval(timer)
    }, [isMobile])

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const pinContainer = pinContainerRef.current;
        if (!pinContainer) return;

        const images = pinContainer.querySelectorAll('.integration-img');
        const descriptions = pinContainer.querySelectorAll('.integration-desc');

        let mm = gsap.matchMedia();

        mm.add("(min-width: 1024px)", () => {
            const titles = pinContainer.querySelectorAll('.integration-item');

            // Apply to desktop
            gsap.set(images, {
                opacity: (i: number) => i === 0 ? 1 : 0,
                zIndex: (i: number) => i,
            });

            // Initialize descriptions
            gsap.set(descriptions, {
                height: (i: number) => i === 0 ? "auto" : "0px",
                opacity: (i: number) => i === 0 ? 1 : 0,
                marginTop: (i: number) => i === 0 ? "12px" : "0px"
            });

            // Initialize titles
            gsap.set(titles, {
                color: (i: number) => i === 0 ? "#000000" : "#9CA3AF"
            });

            let currentActiveStep = 0;

            const goToStep = (index: number) => {
                images.forEach((img, i) => {
                    gsap.to(img, {
                        opacity: i === index ? 1 : 0,
                        duration: 0.4,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                });

                titles.forEach((title, i) => {
                    gsap.to(title, {
                        color: i === index ? "#000000" : "#9CA3AF",
                        duration: 0.4,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                });

                descriptions.forEach((desc, i) => {
                    if (i === index) {
                        gsap.to(desc, {
                            height: "auto",
                            opacity: 1,
                            marginTop: "12px",
                            duration: 0.4,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    } else {
                        gsap.to(desc, {
                            height: "0px",
                            opacity: 0,
                            marginTop: "0px",
                            duration: 0.4,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                });
            };

            const trigger = ScrollTrigger.create({
                trigger: pinContainer,
                start: "top top",
                end: "+=2400", // scroll distance for pinning
                pin: true,
                scrub: false,
                snap: {
                    snapTo: 1 / (steps.length - 1),
                    duration: { min: 0.15, max: 0.4 },
                    delay: 0.02,
                    ease: "power2.out"
                },
                onUpdate: (self) => {
                    const progress = self.progress;
                    const numSteps = steps.length;

                    // Determine the step index (0 to 3) based on scroll progress
                    let step = Math.floor(progress * numSteps);
                    if (step >= numSteps) step = numSteps - 1;

                    if (step !== currentActiveStep) {
                        currentActiveStep = step;
                        goToStep(step);
                    }
                }
            });
        });

        mm.add("(max-width: 1023px)", () => {
            // Reset/clear GSAP properties on mobile resize
            gsap.set(images, { clearProps: "all" });
            gsap.set(descriptions, { clearProps: "all" });
        });

        return () => {
            mm.revert();
        };
    }, []);

    return (
        <div ref={pinContainerRef} className="w-full bg-white font-satoshi overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col justify-center py-4 lg:py-0 min-h-[600px] lg:h-screen lg:min-h-0">

                {/* Header */}
                <div className="mb-6 lg:mb-20">
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-medium tracking-normal mb-2 md:mb-6">
                        The Joyzen Care Layer
                    </h2>
                    <p className="font-epilogue text-lg md:text-2xl max-w-3xl leading-[1.2] mb-2">
                        One system supporting every stage of the healthcare journey.
                    </p>
                    <p className="font-epilogue italic text-sm md:text-xl max-w-3xl leading-[1.2]">Healthcare doesn't begin at the consultation, and it doesn't end when the patient leaves. Joyzen creates a connected care experience across every stage of health.</p>
                </div>

                {/* 2-Column Content */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-26">

                    {/* Left Column: Fixed aspect stacked images */}
                    <div className="w-full lg:w-1/2 relative aspect-[3/2] md:aspect-[7/5] max-w-[700px] rounded-xl overflow-hidden">
                        {steps.map((step, idx) => (
                            <div
                                key={`img-${idx}`}
                                className={`integration-img absolute inset-0 ${isMobile
                                    ? `transition-opacity duration-700 ease-in-out ${activeStep === idx
                                        ? "opacity-100 pointer-events-auto"
                                        : "opacity-0 pointer-events-none"
                                    }`
                                    : ""
                                    }`}
                            >
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>

                        ))}
                    </div>

                    {/* Right Column: Steps with expandable text */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4 md:gap-2 h-[240px] lg:h-auto">
                        {steps.map((step, idx) => {
                            const isActive = activeStep === idx;
                            return (
                                <div
                                    key={`item-${idx}`}
                                    className="border-b border-gray-200 pb-2 md:pb-6"
                                >
                                    {/* Title */}
                                    <h3
                                        className={`integration-item text-xl md:text-2xl font-medium ${isMobile ? "transition-colors duration-500" : ""
                                            } ${isActive
                                                ? "text-black"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {step.title}
                                    </h3>

                                    {/* Description (Expandable container) */}
                                    <div
                                        className={`integration-desc overflow-hidden ${isMobile ? "transition-all duration-500 ease-in-out" : ""
                                            }`}
                                        style={{
                                            maxHeight: isMobile
                                                ? isActive
                                                    ? "100px"
                                                    : "0px"
                                                : undefined,
                                            opacity: isMobile
                                                ? isActive
                                                    ? 1
                                                    : 0
                                                : undefined,
                                            marginTop: isMobile
                                                ? isActive
                                                    ? "8px"
                                                    : "0px"
                                                : undefined
                                        }}
                                    >
                                        <p className="text-base md:text-xl font-normal leading-tight">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default IntegrationSection
