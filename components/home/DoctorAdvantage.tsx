"use client"
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import TextReveal from '@/reUseable/TextReveal'

const TOTAL_FRAMES = 297;

const cloudTexts = [
    {
        text: "Connect with more patients through the Joyzen ecosystem.",
        top: "15%", left: "5%", right: undefined,
        mobileTop: "24%", mobileLeft: "-25px", mobileRight: undefined,
    },
    {
        text: "Build lasting patient relationships through continuous care.",
        top: "45%", left: "2%", right: undefined,
        mobileTop: "52%", mobileLeft: "-30px", mobileRight: undefined,
    },
    {
        text: "Become a trusted partner throughout every patient journey.",
        top: "75%", left: "8%", right: undefined,
        mobileTop: "72%", mobileLeft: "-20px", mobileRight: undefined,
    },
    {
        text: "Turn expertise into growth, retention, and influence.",
        top: "15%", left: undefined, right: "5%",
        mobileTop: "20%", mobileLeft: undefined, mobileRight: "-25px",
    },
    {
        text: "Great doctors are remembered for the lives they change.",
        top: "45%", left: undefined, right: "2%",
        mobileTop: "38%", mobileLeft: undefined, mobileRight: "-30px",
    },
    {
        text: "Build authority through education, insights, and trust.",
        top: "75%", left: undefined, right: "8%",
        mobileTop: "80%", mobileLeft: undefined, mobileRight: "-25px",
    },
];

const DoctorAdvantage = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        // Run asynchronously on mount to avoid synchronous setState warning inside useEffect
        const timer = setTimeout(handleResize, 0);
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 1. ScrollTrigger Timeline Animation (Frame sequence and entry fade-in of clouds)
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, Draggable);

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
            const frameNum = i.toString().padStart(6, '0');
            img.src = `/3dbodyseq/frame-${frameNum}.jpg`;
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

        const mm = gsap.matchMedia();

        // Desktop Breakpoint
        mm.add("(min-width: 768px)", () => {
            gsap.set(canvas, { scale: 0.7, y: "0px", opacity: 0 });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%",
                    pin: true,
                    scrub: 0.5,
                }
            });

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

            timeline.fromTo(canvas,
                { y: "50vh", opacity: 0 },
                { y: "0px", opacity: 1, duration: 0.8, ease: "power1.out" },
                0
            );

            // Desktop clouds entry stagger
            const randomOrder = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
            randomOrder.forEach((idx, i) => {
                const cloud = cloudRefs.current[idx];
                if (!cloud) return;
                const appearStart = 0.2 + (i * 0.08);

                timeline.fromTo(cloud,
                    { opacity: 0, y: 30, scale: 0.8, pointerEvents: "none" },
                    { opacity: 1, y: 0, scale: 1, pointerEvents: "auto", duration: 0.35, ease: "back.out(1.2)" },
                    appearStart
                );
            });
        });

        // Mobile Breakpoint
        mm.add("(max-width: 767px)", () => {
            gsap.set(canvas, { scale: 1.3, y: "0px", opacity: 0 });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%",
                    pin: true,
                    scrub: 0.5,
                }
            });

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

            timeline.fromTo(canvas,
                { y: "20vh", opacity: 0 },
                { y: "0px", opacity: 1, duration: 0.5, ease: "power1.out" },
                0
            );

            // Mobile clouds entry stagger (appearing in environment positions)
            const mobileOrder = [3, 0, 4, 1, 2, 5];
            mobileOrder.forEach((idx, i) => {
                const cloud = cloudRefs.current[idx];
                if (!cloud) return;
                const appearStart = 0.15 + (i * 0.12);

                timeline.fromTo(cloud,
                    { opacity: 0, scale: 0.7, y: 20, pointerEvents: "none" },
                    { opacity: 1, scale: 1, y: 0, pointerEvents: "auto", duration: 0.3, ease: "back.out(1.2)" },
                    appearStart
                );
            });
        });

        return () => {
            mm.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // 2. Continuous Floating Loop, Drag & Drop, & Mouse/Touch Interactions
    useEffect(() => {
        gsap.registerPlugin(Draggable);

        // Floating loop animations
        const floatAnimations: gsap.core.Tween[] = [];

        cloudRefs.current.forEach((cloud) => {
            if (!cloud) return;
            const floatEl = cloud.querySelector(".cloud-float");
            if (!floatEl) return;

            // Randomized parameters for an organic drifting movement
            const floatY = gsap.utils.random(8, 14);
            const floatX = gsap.utils.random(4, 7);
            const durationY = gsap.utils.random(3.5, 5);
            const durationX = gsap.utils.random(5, 7);
            const delay = gsap.utils.random(0, 1.5);

            const tY = gsap.to(floatEl, {
                y: `+=${floatY}`,
                duration: durationY,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: delay
            });

            const tX = gsap.to(floatEl, {
                x: `+=${floatX}`,
                duration: durationX,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: delay * 0.7
            });

            floatAnimations.push(tY, tX);
        });

        // Initialize GSAP Draggable for each cloud (keeps them in viewport bounds)
        const draggables: Draggable[] = [];
        cloudRefs.current.forEach((cloud) => {
            if (!cloud) return;

            const d = Draggable.create(cloud, {
                type: "x,y",
                bounds: sectionRef.current || undefined,
                edgeResistance: 0.85,
                onClick: function (e) {
                    e.stopPropagation();
                },
                onDragStart: function () {
                    const interactEl = cloud.querySelector(".cloud-interact");
                    if (interactEl) {
                        gsap.to(interactEl, {
                            scale: 1.12,
                            duration: 0.2,
                            ease: "power2.out"
                        });
                    }
                },
                onDragEnd: function () {
                    const interactEl = cloud.querySelector(".cloud-interact");
                    if (interactEl) {
                        gsap.to(interactEl, {
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                }
            });
            draggables.push(...d);
        });

        // Mouse and Touch Interaction Event Listeners
        const eventCleanups: (() => void)[] = [];

        cloudRefs.current.forEach((cloud) => {
            if (!cloud) return;
            const interactEl = cloud.querySelector(".cloud-interact") as HTMLElement;
            if (!interactEl) return;

            const onMouseMove = (e: MouseEvent) => {
                // If currently dragging, bypass the magnetic hover offset
                const dragInstance = Draggable.get(cloud);
                if (dragInstance && dragInstance.isDragging) return;

                const rect = cloud.getBoundingClientRect();
                // Cursor position relative to center of the cloud
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Move the cloud content slightly towards the cursor (magnetic attraction)
                gsap.to(interactEl, {
                    x: x * 0.22,
                    y: y * 0.22,
                    scale: 1.06,
                    duration: 0.4,
                    ease: "power2.out"
                });
            };

            const onMouseLeave = () => {
                const dragInstance = Draggable.get(cloud);
                if (dragInstance && dragInstance.isDragging) return;

                // Restore baseline position and scale smoothly
                gsap.to(interactEl, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                });
            };

            const onTouchStart = () => {
                const dragInstance = Draggable.get(cloud);
                if (dragInstance && dragInstance.isDragging) return;

                gsap.to(interactEl, {
                    scale: 1.06,
                    duration: 0.3,
                    ease: "power2.out"
                });
            };

            const onTouchEnd = () => {
                const dragInstance = Draggable.get(cloud);
                if (dragInstance && dragInstance.isDragging) return;

                gsap.to(interactEl, {
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            };

            cloud.addEventListener("mousemove", onMouseMove);
            cloud.addEventListener("mouseleave", onMouseLeave);
            cloud.addEventListener("touchstart", onTouchStart, { passive: true });
            cloud.addEventListener("touchend", onTouchEnd, { passive: true });

            eventCleanups.push(() => {
                cloud.removeEventListener("mousemove", onMouseMove);
                cloud.removeEventListener("mouseleave", onMouseLeave);
                cloud.removeEventListener("touchstart", onTouchStart);
                cloud.removeEventListener("touchend", onTouchEnd);
            });
        });

        return () => {
            floatAnimations.forEach(t => t.kill());
            draggables.forEach(d => d.kill());
            eventCleanups.forEach(clean => clean());
        };
    }, [isMobile]);

    return (
        <section ref={sectionRef} style={{ background: 'linear-gradient(to bottom, #C5E6FF 0%, #FDFDFE 60%, #FFFFFF 100%)' }} className="relative w-full h-screen font-noria overflow-hidden flex items-center justify-center">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-60"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                }}
            >
                <source src="/clouds.mp4" type="video/mp4" />
            </video>


            {/* Header Title Layer */}
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

            {/* Image Sequence Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-contain pointer-events-none z-0 mt-20 opacity-0 mix-blend-multiply"
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
                        className="absolute w-[230px] sm:w-[320px] md:w-[400px] lg:w-[450px] aspect-[2.5/1] opacity-0 z-10 cursor-grab active:cursor-grabbing select-none"
                        style={{
                            top,
                            left,
                            right,
                        }}
                    >
                        {/* Layer 2: Floating container */}
                        <div className="cloud-float w-full h-full">
                            {/* Layer 3: Interaction container */}
                            <div className="cloud-interact w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-8 relative">
                                <p className="relative z-10 text-black text-center font-noria text-sm md:text-lg font-medium leading-tight max-w-[80%] pt-2 pointer-events-none">
                                    {cloud.text}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default DoctorAdvantage;
