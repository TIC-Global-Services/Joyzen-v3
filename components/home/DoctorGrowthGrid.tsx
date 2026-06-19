"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TOTAL_FRAMES = 297;

const cloudTexts = [
    { text: "Connect with more patients through the Joyzen ecosystem.", top: "15%", left: "5%" },
    { text: "Build lasting patient relationships through continuous care.", top: "45%", left: "2%" },
    { text: "Become a trusted partner throughout every patient journey.", top: "75%", left: "8%" },
    { text: "Turn expertise into growth, retention, and influence.", top: "15%", right: "5%" },
    { text: "Great doctors are remembered for the lives they change.", top: "45%", right: "2%" },
    { text: "Build authority through education, insights, and trust.", top: "75%", right: "8%" },
];

const DoctorGrowthGrid = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = 1920;
        canvas.height = 1080;

        // Preload images
        const images: HTMLImageElement[] = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            // Pad the frame number to 6 digits, e.g., frame-000000.jpg
            const frameNum = i.toString().padStart(6, '0');
            img.src = `/3dbodyseq/frame-${frameNum}.jpg`;
            images.push(img);
        }

        const renderFrame = (index: number) => {
            if (images[index] && images[index].complete) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                // Draw the optimized white-background JPEG
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
                trigger: sectionRef.current,
                start: "top top",
                end: "+=300%",
                pin: true,
                scrub: 0.5, // Smooth scrubbing
            }
        });

        // 1. Animate the canvas frames based on scroll progress
        const frameObj = { frame: 0 };
        timeline.to(frameObj, {
            frame: TOTAL_FRAMES - 1,
            snap: "frame",
            ease: "none",
            duration: 1, // Timeline duration is 1, clouds will be mapped relative to this
            onUpdate: () => {
                renderFrame(Math.round(frameObj.frame));
            }
        }, 0);

        // 2. Animate the clouds appearing in random order
        // Stagger their appearance across the timeline
        const randomOrder = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);

        randomOrder.forEach((idx, i) => {
            const cloud = cloudRefs.current[idx];
            if (!cloud) return;

            // Start appearing slightly after the scroll starts, staggered
            const appearStart = 0.1 + (i * 0.12);

            timeline.fromTo(cloud,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                appearStart
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-white font-noria overflow-hidden flex items-center justify-center">
            {/* Header Title Layer (if desired, optional based on design) */}
            <div className="absolute top-12 md:top-20 w-full text-center z-20 pointer-events-none px-4">
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black">
                    Growth Built into Care
                </h2>
            </div>

            {/* Image Sequence Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-contain scale-[0.8] pointer-events-none z-0 mt-12"
            />

            {/* Clouds Overlay */}
            {cloudTexts.map((cloud, idx) => (
                <div
                    key={`cloud-${idx}`}
                    ref={el => { cloudRefs.current[idx] = el; }}
                    className="absolute w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px] aspect-[2.5/1] flex items-center justify-center p-4 md:p-8 opacity-0 z-10"
                    style={{
                        top: cloud.top,
                        left: cloud.left,
                        right: cloud.right,
                    }}
                >
                    <div
                        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-90 scale-150"
                        style={{ backgroundImage: 'url(/cloud-2.png)' }}
                    />
                    <div className="absolute inset-[-20%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(255,255,255,0.85)_50%,white_80%)] pointer-events-none z-0" />
                    <p className="relative z-10 text-black text-center font-noria text-sm md:text-base lg:text-lg font-medium leading-tight max-w-[80%] pt-2">
                        {cloud.text}
                    </p>
                </div>
            ))}
        </section>
    );
};

export default DoctorGrowthGrid;
