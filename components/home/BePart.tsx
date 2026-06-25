"use client"
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/reUseable/TextReveal'

const TOTAL_FRAMES = 274;
const START_FRAME = 0;

const BePart = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const isAutoplaying = useRef(false)
    const [isActive, setIsActive] = useState(false)

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
            // Pad the frame number to 6 digits, e.g., frame-000000.jpg
            const frameNum = (i + START_FRAME).toString().padStart(6, '0');
            img.src = `/joyzenhandsnew/frame-${frameNum}.jpg`;
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
            paused: true,
            onUpdate: () => {
                setIsActive(timeline.progress() >= 0.85);
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

        // 3. Fade in the text content wrapper
        timeline.fromTo(contentRef.current,
            { opacity: 0, scale: 0.98 },
            { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" },
            0.85
        );

        let idleTimeout: ReturnType<typeof setTimeout> | null = null;
        let activeTween: gsap.core.Tween | null = null;

        const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const handleTouchStart = () => {
            isAutoplaying.current = false;
            if (activeTween) {
                activeTween.kill();
                activeTween = null;
            }
        };

        const handleTouchEnd = () => {
            if (!trigger.isActive || isAutoplaying.current) return;
            const currentProgress = timeline.progress();
            if (currentProgress > 0.01 && currentProgress < 0.99) {
                isAutoplaying.current = true;
                const targetScroll = trigger.direction === 1 ? trigger.end : trigger.start;
                const targetProgress = trigger.direction === 1 ? 1 : 0;

                // Smoothly animate scroll position to override native inertia
                const scrollObj = { y: window.scrollY };
                activeTween = gsap.to(scrollObj, {
                    y: targetScroll,
                    duration: 1.2,
                    ease: "power2.out",
                    onUpdate: () => {
                        window.scrollTo(0, scrollObj.y);
                    },
                    onComplete: () => {
                        isAutoplaying.current = false;
                    }
                });

                // Smoothly animate timeline progress in sync
                gsap.to(timeline, {
                    progress: targetProgress,
                    duration: 1.2,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        };

        if (isTouch) {
            window.addEventListener('touchstart', handleTouchStart, { passive: true });
            window.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "+=250%",
            pin: true,
            onUpdate: (self) => {
                if (isAutoplaying.current) return;

                // Clear any pending idle timeouts
                if (idleTimeout) {
                    clearTimeout(idleTimeout);
                    idleTimeout = null;
                }

                // Kill any active autoplay or chase tween
                if (activeTween) {
                    activeTween.kill();
                    activeTween = null;
                }

                let targetProgress = self.progress;

                // When scrolling down, prevent reversing if the animation has autoplayed forward.
                // This prevents visual jumps and un-blurring when the user starts scrolling again to scroll past.
                if (self.direction === 1) {
                    targetProgress = Math.max(timeline.progress(), self.progress);
                }

                if (isTouch) {
                    // On touch devices (no Lenis), always use a smooth chase tween to filter out native scroll jitter
                    activeTween = gsap.to(timeline, {
                        progress: targetProgress,
                        duration: 0.25,
                        ease: "power1.out",
                        overwrite: "auto"
                    });
                } else {
                    const diff = Math.abs(timeline.progress() - targetProgress);
                    if (diff < 0.02) {
                        // If the difference is tiny, update directly to avoid lag and prevent constant tween creation.
                        timeline.progress(targetProgress);
                    } else {
                        // Smoothly bridge the gap if there is a discrepancy (e.g. after autoplaying or sudden scroll jumps)
                        activeTween = gsap.to(timeline, {
                            progress: targetProgress,
                            duration: 0.3,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                }

                // Start idle timer to autoplay to reveal/hide content if user stops scrolling (desktop only)
                if (!isTouch) {
                    idleTimeout = setTimeout(() => {
                        if (!trigger.isActive) return;

                        const currentProgress = timeline.progress();

                        // Only trigger scroll-to-reveal or scroll-to-hide if not already at the boundaries
                        if (currentProgress > 0.01 && currentProgress < 0.99) {
                            const lenis = (window as any).lenis;

                            // If scrolling down, autoplay forward by scrolling the viewport to trigger.end.
                            // If scrolling up (backward), autoplay backward by scrolling the viewport to trigger.start.
                            const targetScroll = self.direction === 1 ? trigger.end : trigger.start;

                            // Calculate duration proportional to remaining scroll distance
                            const distanceFraction = self.direction === 1 ? (1 - self.progress) : self.progress;
                            const duration = Math.max(0.5, distanceFraction * 3.5); // Slower, premium transition

                            if (lenis) {
                                lenis.scrollTo(targetScroll, {
                                    duration: duration,
                                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                                });
                            } else {
                                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                            }
                        } else if (currentProgress < 1 && self.direction === 1) {
                            timeline.progress(1);
                        } else if (currentProgress > 0 && self.direction === -1) {
                            timeline.progress(0);
                        }
                    }, 50); // 50ms of scroll idle for instant but reliable response
                }
            },
            onLeaveBack: () => {
                isAutoplaying.current = false;
                if (idleTimeout) clearTimeout(idleTimeout);
                if (activeTween) activeTween.kill();
                gsap.to(timeline, { progress: 0, duration: 0.3, ease: "power2.out" });
            },
            onLeave: () => {
                isAutoplaying.current = false;
                if (idleTimeout) clearTimeout(idleTimeout);
                if (activeTween) activeTween.kill();
                timeline.progress(1);
            }
        });

        return () => {
            if (idleTimeout) clearTimeout(idleTimeout);
            if (activeTween) activeTween.kill();
            if (isTouch) {
                window.removeEventListener('touchstart', handleTouchStart);
                window.removeEventListener('touchend', handleTouchEnd);
            }
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
                className="absolute w-full h-full object-contain md:object-cover scale-100 md:scale-[1.2] pointer-events-none z-10 opacity-0"
            />



            {/* Central Content (Hidden until end of scroll) */}
            <div ref={contentRef} className="relative z-20 w-full max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center opacity-0">
                <TextReveal
                    tag="h1"
                    type="words"
                    manual={true}
                    active={isActive}
                    className="text-2xl md:text-6xl font-medium tracking-tight leading-tight mb-8 max-w-4xl text-[#EF8F60] uppercase justify-center"
                >
                    Be part of what comes next.
                </TextReveal>
                <TextReveal
                    tag="p"
                    type="words"
                    manual={true}
                    active={isActive}
                    className="font-satoshi text-xl md:text-[32px] leading-tight font-normal mb-12 max-w-5xl text-black drop-shadow-sm justify-center"
                >
                    Joyzen is reimagining how healthcare is delivered, experienced, and connected—creating a future where every patient, provider, and clinic is part of one continuous care ecosystem.
                </TextReveal>

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
                    className="group text-[16px] md:text-[17px] bg-[#1A1A1A] text-white hover:bg-[#b4def7] hover:text-[#1A1A1A] transition-all duration-300 tracking-tight px-12 py-4 rounded-full font-medium shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
                    style={{ paddingTop: '16px', paddingBottom: '16px' }}
                >
                    Join Now
                    <span className="inline-block transition-transform group-hover:translate-x-1 duration-300">→</span>
                </button>
            </div>

        </section>
    )
}

export default BePart
