"use client"
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextReveal from '@/reUseable/TextReveal'

const BePart = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const isAutoplaying = useRef(false)
    const [isActive, setIsActive] = useState(false)
    const [videoSrc, setVideoSrc] = useState<string>('')

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        setVideoSrc(isMobile ? '/joyzenhandsmob_keyframe.mp4' : '/joyzenhandsnew.mp4');
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current || !videoRef.current || !contentRef.current || !videoSrc) return;

        const video = videoRef.current;

        let idleTimeout: ReturnType<typeof setTimeout> | null = null;
        let activeTween: gsap.core.Tween | null = null;
        let trigger: ScrollTrigger;

        const setupAnimation = () => {
            const timeline = gsap.timeline({
                paused: true,
                onUpdate: () => {
                    setIsActive(timeline.progress() >= 0.85);
                }
            });

            // 0. Fade in video at the start of the sequence
            timeline.fromTo(video,
                { opacity: 0 },
                { opacity: 1, duration: 0.1, ease: "power2.out" },
                0
            );

            // 1. Animate the video time based on scroll progress
            const timeObj = { time: 0 };
            timeline.to(timeObj, {
                time: video.duration || 1,
                ease: "none",
                duration: 1,
                onUpdate: () => {
                    video.currentTime = timeObj.time;
                }
            }, 0);

            // 2. Blur the video at the end of the timeline
            timeline.to(video, {
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

            const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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
                            ease: "power1.out",
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

            // Need to return a cleanup function specifically for the touch listeners added within setupAnimation
            return () => {
                if (isTouch) {
                    window.removeEventListener('touchstart', handleTouchStart);
                    window.removeEventListener('touchend', handleTouchEnd);
                }
            };
        };

        let innerCleanup: (() => void) | undefined;

        if (video.readyState >= 1) {
            innerCleanup = setupAnimation();
            setTimeout(() => {
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            }, 50);
        } else {
            const onLoadedMetadata = () => {
                innerCleanup = setupAnimation();
                setTimeout(() => {
                    ScrollTrigger.sort();
                    ScrollTrigger.refresh();
                }, 50);
            };
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            innerCleanup = () => {
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
            };
        }

        // Force mobile browsers to load and unlock the video
        video.load();
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                video.pause();
            }).catch(() => { });
        }

        return () => {
            if (idleTimeout) clearTimeout(idleTimeout);
            if (activeTween) activeTween.kill();
            if (innerCleanup) innerCleanup();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [videoSrc]);

    return (
        <section ref={containerRef} id="waitlist" className="relative w-full h-screen bg-white font-noria overflow-hidden flex items-center justify-center">

            {/* Background Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(239,143,96,0.08)_0%,transparent_70%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(3,97,50,0.05)_0%,transparent_80%)]" />
            </div>

            {/* Video Container */}
            {videoSrc && (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="absolute w-full h-full object-cover scale-100 md:scale-[1.2] pointer-events-none z-10 opacity-0"
                    muted
                    playsInline
                    preload="auto"
                />
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
