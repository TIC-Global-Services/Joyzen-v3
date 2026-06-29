"use client"
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/reUseable/TextReveal'

const DoctorAdvantage = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [videoSrc, setVideoSrc] = useState<string>('');

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        setVideoSrc(isMobile ? '/3dbodymobseq.mp4' : '/3dbodyupscaledseq.mp4');
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !videoRef.current || !videoSrc) return;

        const video = videoRef.current;
        
        const setupAnimation = () => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=600%", // Increased from 300% to 600% to make the video play slower over a longer scroll distance
                    pin: true,
                    scrub: 1.5, // Increased from 0.5 to 1.5 to add more smoothing/easing to the video scrubbing
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

            // Scrub video
            timeline.fromTo(video, 
                { currentTime: 0 }, 
                { 
                    currentTime: video.duration || 1, 
                    ease: "none", 
                    duration: 1 
                }, 
                0
            );

            // Force recalculation since this is created asynchronously after loadedmetadata
            setTimeout(() => {
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            }, 50);
        };

        if (video.readyState >= 1) {
            setupAnimation();
        } else {
            video.addEventListener('loadedmetadata', setupAnimation);
        }

        return () => {
            video.removeEventListener('loadedmetadata', setupAnimation);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [videoSrc]);

    return (
        <section ref={sectionRef} className="relative w-full h-screen font-noria overflow-hidden flex items-center justify-center bg-white">
            {/* Background Sky Image */}
            <img src="/sky.png" alt="Sky Background" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />

            {/* Video Sequence */}
            {videoSrc && (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover md:object-[50%_20%] pointer-events-none z-0 mix-blend-normal scale-100 origin-bottom md:origin-center"
                    muted
                    playsInline
                    preload="auto"
                />
            )}

            {/* Header Title Layer */}
            <div ref={headerRef} className="absolute top-12 md:top-24 left-0 w-full max-w-[1440px] px-6 md:px-12 xl:px-16 z-20 pointer-events-none flex flex-col items-start justify-start">
                <TextReveal
                    tag="h2"
                    className="text-3xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] tracking-tight text-black uppercase text-left max-w-[280px] sm:max-w-xl"
                >
                    The <span className="text-[#EF8F60]">Joyzen</span> doctor advantage
                </TextReveal>
                <TextReveal
                    tag="p"
                    delay={0.1}
                    className="font-satoshi text-xl md:text-2xl lg:text-3xl md:max-w-lg max-w-[200px] leading-[1.2] text-gray-800 mt-4 text-left"
                >
                    Growth is no longer dependent only on patient volume.
                </TextReveal>
            </div>
        </section>
    );
};

export default DoctorAdvantage;
