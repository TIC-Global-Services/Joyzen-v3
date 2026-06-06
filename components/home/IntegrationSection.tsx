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
        title: "Before consultation",
        description: "patient education and onboarding",
        image: imgBefore
    },
    {
        title: "During Consultation",
        description: "clinical notes, EMR sync, and easy recording",
        image: imgDuring
    },
    {
        title: "After Consultation",
        description: "e-prescribing, labs, invoicing, and messaging",
        image: imgAfter
    },
    {
        title: "Between Visits",
        description: "continuous tracking and follow-up support",
        image: imgBetween
    }
]

const IntegrationSection = () => {
    const pinContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const pinContainer = pinContainerRef.current;
        if (!pinContainer) return;

        const images = pinContainer.querySelectorAll('.integration-img');
        const descriptions = pinContainer.querySelectorAll('.integration-desc');

        let ctx = gsap.context(() => {
            // Apply to all screen sizes
            gsap.set(images, {
                yPercent: (i: number) => i === 0 ? 0 : 100,
                zIndex: (i: number) => i,
                opacity: 1 // ensure they are fully opaque
            });

            // Initialize descriptions
            gsap.set(descriptions, {
                height: (i: number) => i === 0 ? "auto" : "0px",
                opacity: (i: number) => i === 0 ? 1 : 0,
                marginTop: (i: number) => i === 0 ? "12px" : "0px"
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pinContainer,
                    start: "top top",
                    end: "+=2400", // scroll distance for pinning
                    scrub: 0.5,
                    pin: true,
                    invalidateOnRefresh: true,
                }
            });

            // Step 1 to 2
            tl.to(images[1], { yPercent: 0, duration: 1 }, "s1_2")
                .to(descriptions[0], { height: 0, opacity: 0, marginTop: 0, duration: 1 }, "s1_2")
                .to(descriptions[1], { height: "auto", opacity: 1, marginTop: "12px", duration: 1 }, "s1_2");

            // Step 2 to 3
            tl.to(images[2], { yPercent: 0, duration: 1 }, "s2_3")
                .to(descriptions[1], { height: 0, opacity: 0, marginTop: 0, duration: 1 }, "s2_3")
                .to(descriptions[2], { height: "auto", opacity: 1, marginTop: "12px", duration: 1 }, "s2_3");

            // Step 3 to 4
            tl.to(images[3], { yPercent: 0, duration: 1 }, "s3_4")
                .to(descriptions[2], { height: 0, opacity: 0, marginTop: 0, duration: 1 }, "s3_4")
                .to(descriptions[3], { height: "auto", opacity: 1, marginTop: "12px", duration: 1 }, "s3_4");

        }, pinContainer);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <div ref={pinContainerRef} className="w-full bg-white font-satoshi overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 md:px-2 h-[100dvh] flex flex-col justify-center py-6 lg:py-0">

                {/* Header */}
                <div className="mb-6 lg:mb-20">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2 md:mb-4">
                        How We Integrate With Clinics
                    </h2>
                    <p className="text-lg md:text-2xl max-w-3xl leading-tight">
                        We fit into your clinic, without taking control. Your clinic continues to operate under your medical expertise. Joyzen adds the system around you:
                    </p>
                </div>

                {/* 2-Column Content */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-20">

                    {/* Left Column: Fixed aspect stacked images */}
                    <div className="w-full lg:w-1/2 relative aspect-[4/3] max-w-[500px] rounded-3xl overflow-hidden shadow-xl bg-gray-50 border border-gray-100">
                        {steps.map((step, idx) => (
                            <div
                                key={`img-${idx}`}
                                className="integration-img absolute inset-0"
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
                    <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4 md:gap-8">
                        {steps.map((step, idx) => {
                            return (
                                <div
                                    key={`item-${idx}`}
                                    className="border-b border-gray-200 pb-2 md:pb-6"
                                >
                                    {/* Title */}
                                    <h3 className="integration-item text-xl md:text-3xl font-medium">
                                        {step.title}
                                    </h3>

                                    {/* Description (Expandable container) */}
                                    <div className="integration-desc overflow-hidden">
                                        <p className="text-sm md:text-lg font-normal leading-tight">
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
