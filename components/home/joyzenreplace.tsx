"use client"
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const JoyzenReplace = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const container = containerRef.current;
        if (!container) return;

        const words = container.querySelectorAll('.word');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: () => window.innerWidth < 768 ? "top 80%" : "top 70%",
                end: () => window.innerWidth < 768 ? "bottom 60%" : "bottom 40%",
                scrub: 0.5,
                invalidateOnRefresh: true,
            }
        });

        // Set initial state
        gsap.set(words, { opacity: 0.2 });

        tl.to(words, {
            opacity: 1,
            stagger: 0.1,
            ease: "none"
        });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    // Helper to split text into words while keeping custom classes
    const splitText = (text: string, customClass: string = "text-black") => {
        return text.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} className={`word opacity-20 inline-block mr-[0.2em] transition-opacity duration-300 ${customClass}`}>
                {word}
            </span>
        ));
    };

    return (
        <div className="relative py-24 px-4 md:py-32 w-full flex justify-center items-center font-satoshi min-h-screen">
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none transform-gpu liquid-gradient" style={{ transform: 'translateZ(0)' }}>

                <div className="absolute -bottom-[5%] -left-[40%] md:left-[-40%] w-[80%] h-[40%] bg-[#b4def7] opacity-100 rounded-[100%] md:blur-[80px] md:block hidden liquid-gradient" />
                <div className="absolute -bottom-[5%] -left-[40%] w-[80%] h-[40%] md:hidden block bg-[radial-gradient(circle,rgba(180,222,247,0.8)_0%,transparent_70%)]" />

                <div className="absolute -bottom-[0%] -right-[30%] w-[70%] h-[30%] bg-[#ddc4df] opacity-100 rounded-[100%] md:blur-[80px] md:block hidden liquid-gradient" />
                <div className="absolute -bottom-[00%] -right-[30%] w-[70%] h-[30%] md:hidden block bg-[radial-gradient(circle,rgba(221,196,223,0.8)_0%,transparent_70%)]" />

                <div className="absolute -bottom-[30%] right-[20%] md:right-[-50%] w-[80%] h-[30%] bg-[#f8e780] opacity-50 rounded-[100%] md:blur-[140px] md:block hidden liquid-gradient" />
                <div className="absolute -bottom-[30%] right-[20%] w-[80%] h-[30%] md:hidden block bg-[radial-gradient(circle,rgba(248,231,128,0.4)_0%,transparent_70%)]" />
            </div>

            <div ref={containerRef} className="text-center text-2xl md:text-3xl lg:text-[2.5rem] font-medium leading-[1.2] tracking-tight">
                <p className="mb-10 md:mb-12">
                    {splitText("Joyzen", "text-[#EF8F60]")} {splitText("replaces fragmented care with a continuous system")}
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    {splitText("where hormones, fertility, and long-term health are managed")}
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    {splitText("together.")}
                </p>

                <p className="mb-10 md:mb-12">
                    {splitText("Online or in clinic - it's the same person")}
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    {splitText("guiding your care.")}
                </p>

                <p className="mb-10 md:mb-12">
                    {splitText("Tracking your progress.", "text-black")} {splitText("Adjusting your treatment.")}
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    {splitText("Moving you forward.")}
                </p>

                <p>
                    {splitText("Joyzen connects you to the right doctor")}
                    <br className="hidden md:block" />
                    <span className="md:hidden"> </span>
                    {splitText("and keeps your care continuous across every step.")}
                </p>
                <button className="mt-8 md:mt-12 text-[14px] md:text-[16px] bg-white border font-sans border-[#FFFFFF0A] tracking-tight px-8 py-3 rounded-full font-medium shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95">
                        Start Your Application
                </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        </div>
    )
}

export default JoyzenReplace