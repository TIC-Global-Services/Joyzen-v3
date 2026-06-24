"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/reUseable/TextReveal'

const DoctorAdvantage = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const isMobile = window.innerWidth < 768;
        
        // Mobile video is 9:16, Desktop is 16:9
        canvas.width = isMobile ? 1080 : 1920;
        canvas.height = isMobile ? 1920 : 1080;

        const frameCount = isMobile ? 442 : 381;
        const sequencePath = isMobile ? '/3dbodymobseq' : '/3dbodyupscaledseq';

        // Preload images
        const images: HTMLImageElement[] = [];
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            // ffmpeg outputs frames starting from 1
            const frameNum = (i + 1).toString().padStart(6, '0');
            img.src = `${sequencePath}/frame-${frameNum}.jpg`;
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

        renderFrame(0);

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=300%",
                pin: true,
                scrub: 0.5,
            }
        });

        if (headerRef.current) {
            // Blur and fade out header at the start of scroll (15% of timeline)
            timeline.to(headerRef.current, {
                opacity: 0,
                filter: "blur(12px)",
                duration: 0.15,
                ease: "power1.inOut"
            }, 0);
        }

        const frameObj = { frame: 0 };
        timeline.to(frameObj, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            duration: 1, // Set explicit duration so the 0.15 header duration is relative to this
            onUpdate: () => {
                renderFrame(Math.round(frameObj.frame));
            }
        }, 0); // Both start at timeline beginning

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen font-noria overflow-hidden flex items-center justify-center bg-white">
            {/* Background Sky Image */}
            <img src="/sky.png" alt="Sky Background" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />

            {/* Image Sequence Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 mix-blend-multiply scale-100 origin-bottom md:origin-center"
            />

            {/* Header Title Layer */}
            <div ref={headerRef} className="absolute top-12 md:top-24 left-0 w-full max-w-[1440px] px-6 md:px-12 xl:px-16 z-20 pointer-events-none flex flex-col items-start justify-start">
                <TextReveal
                    tag="h2"
                    className="text-3xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] tracking-tight text-black uppercase text-left max-w-2xl"
                >
                    The <span className="text-[#EF8F60]">Joyzen</span> doctor advantage
                </TextReveal>
                <TextReveal
                    tag="p"
                    delay={0.1}
                    className="font-satoshi text-xl md:text-2xl lg:text-3xl max-w-xl leading-[1.2] text-gray-800 mt-4 text-left"
                >
                    Growth is no longer dependent only on patient volume.
                </TextReveal>
            </div>
        </section>
    );
};

export default DoctorAdvantage;
