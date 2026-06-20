"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/reUseable/TextReveal'

const TOTAL_FRAMES = 297;

const cloudTexts = [
    {
        text: "Connect with more patients through the Joyzen ecosystem.",
        top: "15%", left: "5%", right: undefined,
        mobileTop: "10%", mobileLeft: "2%", mobileRight: undefined
    },
    {
        text: "Build lasting patient relationships through continuous care.",
        top: "45%", left: "2%", right: undefined,
        mobileTop: "38%", mobileLeft: "1%", mobileRight: undefined
    },
    {
        text: "Become a trusted partner throughout every patient journey.",
        top: "75%", left: "8%", right: undefined,
        mobileTop: "66%", mobileLeft: "3%", mobileRight: undefined
    },
    {
        text: "Turn expertise into growth, retention, and influence.",
        top: "15%", left: undefined, right: "5%",
        mobileTop: "24%", mobileLeft: undefined, mobileRight: "2%"
    },
    {
        text: "Great doctors are remembered for the lives they change.",
        top: "45%", left: undefined, right: "2%",
        mobileTop: "52%", mobileLeft: undefined, mobileRight: "1%"
    },
    {
        text: "Build authority through education, insights, and trust.",
        top: "75%", left: undefined, right: "8%",
        mobileTop: "80%", mobileLeft: undefined, mobileRight: "3%"
    },
];

const DoctorAdvantage = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

        // 2. Animate the canvas moving up from bottom and fading in
        timeline.fromTo(canvas,
            { y: "50vh", opacity: 0 },
            { y: "0px", opacity: 1, duration: 0.8, ease: "power1.out" },
            0
        );

        // 3. Animate the clouds appearing in random order
        // Stagger their appearance across the timeline
        const randomOrder = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);

        randomOrder.forEach((idx, i) => {
            const cloud = cloudRefs.current[idx];
            if (!cloud) return;

            // Start appearing staggered as the canvas moves up
            const appearStart = 0.2 + (i * 0.08);

            timeline.fromTo(cloud,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
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
            <div className="absolute top-12 md:top-20 w-full text-center z-20 pointer-events-none px-4 flex flex-col items-center justify-center">
                <TextReveal
                    tag="h2"
                    className="text-3xl md:text-5xl font-medium tracking-tight text-black uppercase text-center"
                >
                    The <span className="text-[#EF8F60]">Joyzen</span> doctor advantage
                </TextReveal>
                <TextReveal
                    tag="p"
                    delay={0.1}
                    className="font-satoshi text-xl md:text-3xl max-w-4xl leading-[1.2] mx-auto text-gray-800 [@media(max-height:768px)]:text-lg [@media(max-height:650px)]:text-base mt-2 text-center"
                >
                    Growth is no longer dependent only on patient volume.
                </TextReveal>
            </div>

            {/* Image Sequence Canvas (Scaled up for mobile to be prominent, original desktop dimensions preserved, opacity initially 0) */}
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-contain scale-[1.6] md:scale-[0.7] pointer-events-none z-0 mt-20 opacity-0"
            />

            {/* Clouds Overlay */}
            {cloudTexts.map((cloud, idx) => {
                const top = isMobile ? cloud.mobileTop : cloud.top;
                const left = isMobile ? cloud.mobileLeft : cloud.left;
                const right = isMobile ? cloud.mobileRight : cloud.right;

                return (
                    <div
                        key={`cloud-${idx}`}
                        ref={el => { cloudRefs.current[idx] = el; }}
                        className="absolute w-[230px] sm:w-[320px] md:w-[400px] lg:w-[450px] aspect-[2.5/1] flex items-center justify-center p-3 sm:p-6 md:p-8 opacity-0 z-10"
                        style={{
                            top,
                            left,
                            right,
                        }}
                    >
                        <div
                            className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-90 scale-150 pointer-events-none"
                            style={{ backgroundImage: 'url(/cloud-2.png)' }}
                        />
                        <div className="absolute inset-[-20%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(255,255,255,0.85)_50%,white_80%)] pointer-events-none z-0" />
                        <p className="relative z-10 text-black text-center font-noria text-sm md:text-lg font-medium leading-tight max-w-[80%] pt-2 pointer-events-none">
                            {cloud.text}
                        </p>
                    </div>
                );
            })}
        </section>
    );
};

export default DoctorAdvantage;
