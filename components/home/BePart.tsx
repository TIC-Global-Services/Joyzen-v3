"use client"
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import TextReveal from '@/reUseable/TextReveal'
import { loadFramesBatched } from '@/lib/loadFrames'

const BePart = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const isAutoplaying = useRef(false)
    const [isActive, setIsActive] = useState(false)

    const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef<number>(1);
    const [totalFrames, setTotalFrames] = useState(92);

    // Draw a specific frame to the canvas with cover sizing
    const drawFrame = (frameIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        let img = imagesRef.current[frameIndex - 1];
        
        // Fallback to nearest loaded image if the requested frame isn't fully loaded yet
        if (!img || !img.complete) {
            let found = false;
            // Search backward first
            for (let i = frameIndex - 1; i >= 0; i--) {
                if (imagesRef.current[i] && imagesRef.current[i].complete) {
                    img = imagesRef.current[i];
                    found = true;
                    break;
                }
            }
            // Search forward if still not found
            if (!found) {
                for (let i = frameIndex; i < totalFrames; i++) {
                    if (imagesRef.current[i] && imagesRef.current[i].complete) {
                        img = imagesRef.current[i];
                        found = true;
                        break;
                    }
                }
            }
        }

        if (!img || !img.complete) return;

        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
            // Canvas is wider than image aspect ratio
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            drawX = 0;
            drawY = (canvasHeight - drawHeight) / 2;
        } else {
            // Canvas is taller than image aspect ratio
            drawWidth = canvasHeight * imgRatio;
            drawHeight = canvasHeight;
            drawX = (canvasWidth - drawWidth) / 2;
            drawY = 0;
        }

        context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawFrame(currentFrameRef.current);
    };

    // Determine device type on mount
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        setIsMobileDevice(isMobile);
        setTotalFrames(isMobile ? 91 : 92);
    }, []);

    // Preload images once device type is determined
    useEffect(() => {
        if (isMobileDevice === null) return;

        const tempImages: HTMLImageElement[] = [];
        imagesRef.current = tempImages;

        const folder = isMobileDevice ? 'joyzenhandsmobnew-webp' : 'joyzenhandsnew-webp';

        loadFramesBatched(
            folder,
            totalFrames,
            'webp',
            tempImages,
            () => setFirstFrameLoaded(true),
            (loaded) => setLoadProgress(Math.round((loaded / totalFrames) * 100)),
            () => setImagesLoaded(true)
        );
    }, [isMobileDevice, totalFrames]);

    // Set up ScrollTrigger and resize listener
    useEffect(() => {
        if (isMobileDevice === null || !firstFrameLoaded) return;

        const ctx = gsap.context(() => {
            // Initial sizing and drawing
            handleResize();
            window.addEventListener('resize', handleResize);

            const timeline = gsap.timeline({
                paused: true,
                onUpdate: () => {
                    setIsActive(timeline.progress() >= 0.85);
                }
            });

            const canvas = canvasRef.current;
            if (canvas) {
                // 0. Fade in canvas at the start of the sequence
                timeline.fromTo(canvas,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.1, ease: "power2.out" },
                    0
                );
            }

            // 1. Scrub canvas frames based on scroll progress
            const frameObj = { frame: 1 };
            timeline.to(frameObj, {
                frame: totalFrames,
                ease: "none",
                duration: 1,
                onUpdate: () => {
                    const frameIndex = Math.min(
                        totalFrames,
                        Math.max(1, Math.floor(frameObj.frame))
                    );
                    currentFrameRef.current = frameIndex;
                    drawFrame(frameIndex);
                }
            }, 0);

            // 2. Blur canvas at the end of the timeline
            if (canvas) {
                timeline.to(canvas, {
                    filter: "blur(20px)",
                    duration: 0.2,
                    ease: "power2.inOut"
                }, 0.8);
            }

            // 3. Fade in the text content wrapper
            if (contentRef.current) {
                timeline.fromTo(contentRef.current,
                    { opacity: 0, scale: 0.98 },
                    { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" },
                    0.85
                );
            }

            const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            let activeTween: gsap.core.Tween | null = null;
            let idleTimeout: ReturnType<typeof setTimeout> | null = null;
            let trigger: ScrollTrigger;

            const handleTouchStart = () => {
                isAutoplaying.current = false;
                if (activeTween) {
                    activeTween.kill();
                    activeTween = null;
                }
            };

            const handleTouchEnd = () => {
                if (!trigger?.isActive || isAutoplaying.current) return;
                const currentProgress = timeline.progress();
                if (currentProgress > 0.01 && currentProgress < 0.99) {
                    isAutoplaying.current = true;
                    const targetScroll = trigger.direction === 1 ? trigger.end : trigger.start;
                    const targetProgress = trigger.direction === 1 ? 1 : 0;

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

            trigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=100%",
                pin: true,
                onUpdate: (self) => {
                    if (isAutoplaying.current) return;

                    if (idleTimeout) {
                        clearTimeout(idleTimeout);
                        idleTimeout = null;
                    }

                    if (activeTween) {
                        activeTween.kill();
                        activeTween = null;
                    }

                    let targetProgress = self.progress;

                    if (self.direction === 1) {
                        targetProgress = Math.max(timeline.progress(), self.progress);
                    }

                    if (isTouch) {
                        activeTween = gsap.to(timeline, {
                            progress: targetProgress,
                            duration: 0.25,
                            overwrite: "auto"
                        });
                    } else {
                        const diff = Math.abs(timeline.progress() - targetProgress);
                        if (diff < 0.02) {
                            timeline.progress(targetProgress);
                        } else {
                            activeTween = gsap.to(timeline, {
                                progress: targetProgress,
                                duration: 0.3,
                                ease: "power2.out",
                                overwrite: "auto"
                            });
                        }
                    }

                    if (!isTouch) {
                        idleTimeout = setTimeout(() => {
                            if (!trigger?.isActive) return;

                            const currentProgress = timeline.progress();

                            if (currentProgress > 0.01 && currentProgress < 0.99) {
                                const lenis = (window as any).lenis;
                                const targetScroll = self.direction === 1 ? trigger.end : trigger.start;
                                const distanceFraction = self.direction === 1 ? (1 - self.progress) : self.progress;
                                const duration = Math.max(0.5, distanceFraction * 3.5);

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
                        }, 50);
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
                if (isTouch) {
                    window.removeEventListener('touchstart', handleTouchStart);
                    window.removeEventListener('touchend', handleTouchEnd);
                }
                if (idleTimeout) clearTimeout(idleTimeout);
                if (activeTween) activeTween.kill();
            };
        }, containerRef);

        return () => {
            window.removeEventListener('resize', handleResize);
            ctx.revert();
        };
    }, [isMobileDevice, firstFrameLoaded, totalFrames]);

    return (
        <section ref={containerRef} id="waitlist" className="relative w-full h-screen bg-white font-noria overflow-hidden flex items-center justify-center">

            {/* Background Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(239,143,96,0.08)_0%,transparent_70%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(3,97,50,0.05)_0%,transparent_80%)]" />
            </div>

            {/* Canvas Container */}
            {firstFrameLoaded && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-0"
                />
            )}

            {/* Subtle Progress Bar Overlay while preloading hands */}
            {!imagesLoaded && firstFrameLoaded && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-100 shadow-lg transition-opacity duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-[#EF8F60] border-t-transparent rounded-full animate-spin" />
                        <span className="font-satoshi text-xs font-semibold text-black uppercase tracking-wider">
                            Optimizing view {loadProgress}%
                        </span>
                    </div>
                </div>
            )}

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
                    Joyzen is reimagining how healthcare is delivered, experienced, and connected, creating a future where every patient, provider, and clinic is part of one continuous care ecosystem.
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
