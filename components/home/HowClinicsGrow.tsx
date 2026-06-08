"use client"
import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import clinicGrowBanner from '@/assets/home/general/clinicGrowBanner.png'

const HowClinicsGrow = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const imageWrapperRef = useRef<HTMLDivElement>(null)
    const textOverlayRef = useRef<HTMLDivElement>(null)
    const overlayBgRef = useRef<HTMLDivElement>(null)
    const textLeftRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current || !imageWrapperRef.current || !textOverlayRef.current || !overlayBgRef.current || !textLeftRef.current) return;

        let mm = gsap.matchMedia();

        mm.add({
            isMobile: "(max-width: 767px)",
            isDesktop: "(min-width: 768px)"
        }, (context) => {
            const { isMobile } = context.conditions as any;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=1500", // Defines the scroll distance the section stays pinned
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            // 1. Fade out the left text
            tl.to(textLeftRef.current, {
                opacity: 0,
                x: isMobile ? 0 : -50,
                y: isMobile ? -30 : 0,
                duration: 0.4,
                ease: "power1.inOut"
            }, 0);

            // 2. Expand the image wrapper to full screen
            const expandVars = isMobile
                ? { width: "100%", height: "100%", left: "0px", right: "0px", bottom: "0px", borderRadius: "0px", boxShadow: "none", duration: 1, ease: "power2.inOut" }
                : { width: "100%", height: "100%", right: "0px", borderRadius: "0px", boxShadow: "none", duration: 1, ease: "power2.inOut" };

            tl.to(imageWrapperRef.current, expandVars, 0);

            // 3. Fade in dark overlay over the image
            tl.to(overlayBgRef.current, {
                opacity: 0.65,
                duration: 0.4,
                ease: "power1.inOut"
            }, 0.6); // Start fading overlay halfway through expansion

            // 4. Fade in final centered text
            tl.to(textOverlayRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            }, 0.7);

            return () => { };
        });

        return () => {
            mm.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center font-satoshi">
            {/* Content Container for Initial Left Text */}
            <div className="max-w-[1440px] w-full h-full mx-auto flex items-start md:items-center pt-32 md:pt-0 px-4 md:px-12 relative z-10">
                <div ref={textLeftRef} className="w-full md:w-1/2 pr-4 md:pr-10 text-center md:text-left flex flex-col items-center md:items-start">
                    <h2 className="text-2xl md:text-6xl font-medium leading-[1.2] mb-4 md:mb-6">
                        How Clinics Grow<br className="hidden md:block" /> With Joyzen
                    </h2>
                    <p className="font-epilogue text-xl md:text-2xl leading-[1.2] max-w-md mx-auto md:mx-0">
                        Growth is no longer dependent only on patient volume.
                    </p>
                </div>
            </div>

            {/* Right Image Wrapper */}
            <div
                ref={imageWrapperRef}
                className="absolute bottom-12 md:bottom-0 md:top-0 left-4 right-4 md:left-auto md:right-12 md:my-auto md:w-[52%] h-[60%] md:h-[80%] z-20 overflow-hidden rounded-xl shadow-2xl"
            >
                <Image
                    src={clinicGrowBanner}
                    alt="Doctors celebrating with a high-five"
                    fill
                    className="object-cover object-[45%_center] md:object-center"
                    sizes="100vw"
                    priority
                />

                {/* Dark Overlay Background */}
                <div
                    ref={overlayBgRef}
                    className="absolute inset-0 bg-black/30 opacity-0 z-10"
                />

                {/* Final Overlay Text */}
                <div
                    ref={textOverlayRef}
                    className="absolute inset-0 z-20 flex items-center justify-center p-6 md:p-12 lg:p-24 opacity-0 translate-y-12"
                >
                    <p className="font-epilogue text-white text-2xl md:text-3xl lg:text-[32px] leading-[1.2] text-center max-w-[1000px] font-normal drop-shadow-lg">
                        With Joyzen, clinics can grow through structured care programs, stronger patient retention, increased patient inflow, and improved outcomes that drive referrals. By increasing revenue per patient and fostering long-term relationships instead of one-time visits, Joyzen helps clinics build a stronger, more sustainable, and more valuable practice.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HowClinicsGrow
