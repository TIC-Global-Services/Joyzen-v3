"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TOTAL_FRAMES = 274;
const START_FRAME = 25;

const JoinWaitlistCTA = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current || !canvasRef.current || !contentRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Set high resolution for rendering
        canvas.width = 1920;
        canvas.height = 1080;

        // Preload images
        const images: HTMLImageElement[] = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            // Pad the frame number to 6 digits, e.g., frame-000025.jpg
            const frameNum = (i + START_FRAME).toString().padStart(6, '0');
            img.src = `/joyzenhands/frame-${frameNum}.jpg`;
            images.push(img);
        }

        const renderFrame = (index: number) => {
            if (images[index] && images[index].complete) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
            } else if (images[index]) {
                images[index].onload = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
                }
            }
        };

        // Draw first frame immediately
        renderFrame(0);

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=250%",
                pin: true,
                scrub: 0.5, // Smooth scrubbing
            }
        });

        // 0. Fade in canvas at the start of the sequence
        timeline.fromTo(canvas,
            { opacity: 0 },
            { opacity: 1, duration: 0.1, ease: "power2.out" },
            0
        );

        // 1. Animate the canvas frames based on scroll progress
        const frameObj = { frame: 0 };
        timeline.to(frameObj, {
            frame: TOTAL_FRAMES - 1,
            snap: "frame",
            ease: "none",
            duration: 1,
            onUpdate: () => {
                renderFrame(Math.round(frameObj.frame));
            }
        }, 0);

        // 2. Blur the canvas at the end of the timeline
        timeline.to(canvas, {
            filter: "blur(20px)", // Blur transition to act as background
            duration: 0.2, // 20% of the scroll timeline
            ease: "power2.inOut"
        }, 0.8); // Starts when sequence is 80% done

        // 3. Fade in the text content right as the fade completes
        timeline.fromTo(contentRef.current,
            { opacity: 0, scale: 0.95, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power2.out" },
            0.85 // Start revealing text right as the fade is peaking
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={containerRef} id="waitlist" className="relative w-full h-screen bg-white font-noria overflow-hidden flex items-center justify-center">

            {/* Background Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(239,143,96,0.08)_0%,transparent_70%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(3,97,50,0.05)_0%,transparent_80%)]" />
            </div>

            {/* Image Sequence Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-cover sm:object-contain scale-[1.1] pointer-events-none z-10 opacity-0"
            />



            {/* Central Content (Hidden until end of scroll) */}
            <div ref={contentRef} className="relative z-20 w-full max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center opacity-0">
                <h1 className="text-2xl md:text-6xl font-medium tracking-tight leading-tight mb-8 max-w-4xl text-[#EF8F60] uppercase">
                    Be part of what comes next.
                </h1>
                <p className="font-satoshi text-xl md:text-[32px] leading-tight font-normal mb-12 max-w-5xl text-black drop-shadow-sm">
                    Joyzen is reimagining how healthcare is delivered, experienced, and connected—creating a future where every patient, provider, and clinic is part of one continuous care ecosystem.
                </p>

                <button
                    onClick={() => {
                        if (typeof window !== "undefined" && (window as any).lenis) {
                            (window as any).lenis.scrollTo('#intake-form');
                        } else {
                            const formElement = document.getElementById('intake-form');
                            if (formElement) {
                                formElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }}
                    className="group text-[16px] md:text-[17px] bg-[#1A1A1A] text-white hover:bg-[#036132] transition-all duration-300 tracking-tight px-12 py-4 rounded-full font-medium shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
                    style={{ paddingTop: '16px', paddingBottom: '16px' }}
                >
                    Join Now
                    <span className="inline-block transition-transform group-hover:translate-x-1 duration-300">→</span>
                </button>
            </div>

        </section>
    )
}

export default JoinWaitlistCTA
