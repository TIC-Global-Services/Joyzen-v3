"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import TextReveal from '@/reUseable/TextReveal'
import { loadFramesBatched } from '@/lib/loadFrames'

const SplitText = ({ children }: { children: string }) => {
    return (
        <>
            {children.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-[0.22em] whitespace-nowrap opacity-0">
                    {word}
                </span>
            ))}
        </>
    );
};

const DoctorAdvantage = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef<number>(1);
    const middleLeftRef = useRef<HTMLDivElement>(null);
    const middleRightRef = useRef<HTMLDivElement>(null);
    const frame92TextRef = useRef<HTMLDivElement>(null);
    const frame145TextRef = useRef<HTMLDivElement>(null);
    const frame190TextRef = useRef<HTMLDivElement>(null);
    const frame212TextRef = useRef<HTMLDivElement>(null);

    const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [totalFrames, setTotalFrames] = useState(443);

    // Draw a specific frame to the canvas with cover sizing (and alignment offsets)
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

            // Replicate object-cover alignment
            const isMobile = isMobileDevice ?? (window.innerWidth < 768);
            if (isMobile) {
                // origin-bottom on mobile
                drawY = canvasHeight - drawHeight;
            } else {
                // object-[50%_20%] on desktop
                drawY = (canvasHeight - drawHeight) * 0.2;
            }
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

        // Use layout-driven client dimensions of the canvas element instead of dynamic window.innerHeight.
        // This ensures the canvas pixel resolution matches its CSS bounding box exactly, preventing
        // stretching and jumpiness when mobile address bars retract/expand during vertical scroll.
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight;

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        drawFrame(currentFrameRef.current);
    };

    // Determine device type on mount
    useEffect(() => {
        const checkMobile = window.innerWidth < 768;
        setIsMobileDevice(checkMobile);
        setTotalFrames(checkMobile ? 240 : 443);
    }, []);

    // Preload images once device type is determined
    useEffect(() => {
        if (isMobileDevice === null) return;

        const tempImages: HTMLImageElement[] = [];
        imagesRef.current = tempImages;

        const folder = isMobileDevice ? '3dbodymobframes-webp' : '3dwebpframes';

        loadFramesBatched(
            folder,
            totalFrames,
            'webp',
            tempImages,
            () => setFirstFrameLoaded(true),
            (loaded) => setLoadProgress(Math.round((loaded / totalFrames) * 100)),
            () => setImagesLoaded(true),
            12, // batch size
            isMobileDevice ? 'hyphen' : 'underscore_padded' // naming format
        );
    }, [isMobileDevice, totalFrames]);

    // Set up ScrollTrigger and resize listener once the first frame is loaded
    useEffect(() => {
        if (!firstFrameLoaded) return;

        const ctx = gsap.context(() => {
            // Initial sizing and drawing of the first frame
            handleResize();
            window.addEventListener('resize', handleResize);

            const isMobile = window.innerWidth < 768;
            const getP = (f: number) => (f - 1) / (totalFrames - 1);

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: isMobile ? "+=400%" : "+=550%",
                    pin: true,
                    scrub: 0.5,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const frameIndex = Math.min(
                            totalFrames,
                            Math.max(1, Math.floor(progress * (totalFrames - 1)) + 1)
                        );
                        currentFrameRef.current = frameIndex;
                        drawFrame(frameIndex);
                    }
                }
            });

            // Force the timeline to have a duration of 1.0 so that durations behave as fractions of the total scroll trigger length
            timeline.to({}, { duration: 1.0 }, 0);

            if (headerRef.current) {
                // Blur and fade out header at the start of scroll (first 6% of the timeline)
                timeline.to(headerRef.current, {
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 0.06,
                    ease: "power2.out"
                }, 0);
            }

            const textConfigs = [
                {
                    ref: middleLeftRef,
                    desktop: { start: 62, end: 77, exit: 100 }, // Milestone 77 (Left Text)
                    mobile: { start: 12, end: 30, exit: 35 }
                },
                {
                    ref: middleRightRef,
                    desktop: { start: 62, end: 77, exit: 100 }, // Milestone 77 (Right Text)
                    mobile: { start: 46, end: 60, exit: 67 }
                },
                {
                    ref: frame92TextRef,
                    desktop: { start: 133, end: 148, exit: 190 }, // Milestone 148
                    mobile: { start: 85, end: 100, exit: 110 }
                },
                {
                    ref: frame145TextRef,
                    desktop: { start: 240, end: 255, exit: 290 }, // Milestone 255
                    mobile: { start: 140, end: 155, exit: 165 }
                },
                {
                    ref: frame190TextRef,
                    desktop: { start: 340, end: 355, exit: 380 }, // Milestone 355
                    mobile: { start: 195, end: 210, exit: 220 }
                },
                {
                    ref: frame212TextRef,
                    desktop: { start: 405, end: 420 }, // Milestone 420 (remains visible)
                    mobile: { start: 230, end: 240 }
                }
            ];

            // Prepare parent containers to be visible so that child word spans control the opacity/blur
            textConfigs.forEach(({ ref }) => {
                if (ref.current) {
                    gsap.set(ref.current, { opacity: 1 });
                }
            });

            textConfigs.forEach(({ ref, desktop, mobile }) => {
                const config = isMobile ? mobile : desktop;
                if (!config || !ref.current) return;

                // Select spans for word-by-word stagger, fallback to parent if none
                const spans = ref.current.querySelectorAll('span');
                const target = spans.length > 0 ? spans : ref.current;

                // 1. Fade & Blur In (Staggered word-by-word)
                timeline.fromTo(target,
                    { opacity: 0, filter: "blur(12px)", y: 15 },
                    {
                        opacity: 1,
                        filter: "blur(0px)",
                        y: 0,
                        stagger: { amount: 0.02 }, // Stagger all words over 2% scroll duration
                        duration: getP(config.end) - getP(config.start),
                        ease: "power2.out"
                    },
                    getP(config.start)
                );

                // 2. Fade & Blur Out (optional exit transition staggered)
                if (config.exit) {
                    timeline.to(target,
                        {
                            opacity: 0,
                            filter: "blur(12px)",
                            y: -15,
                            stagger: { amount: 0.015 },
                            duration: 0.04, // Consistent swift 4% scroll trigger duration for exit
                            ease: "power2.in"
                        },
                        getP(config.exit)
                    );
                }
            });
        }, sectionRef);

        // Force scroll trigger refresh to make sure alignment is perfect
        setTimeout(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
        }, 50);

        return () => {
            window.removeEventListener('resize', handleResize);
            ctx.revert(); // Safely reverts all animations and pinning spacers inside this context
        };
    }, [firstFrameLoaded, totalFrames]);

    return (
        <section ref={sectionRef} className="relative w-full h-screen font-noria overflow-hidden flex items-center justify-center bg-white">
            {/* Background Sky Image */}
            <Image
                src="/sky.webp"
                alt="Sky Background"
                fill
                loading="lazy"
                className="absolute inset-0 object-cover pointer-events-none z-0 scale-[1.01]"
            />

            {/* Canvas Image Sequence */}
            {firstFrameLoaded && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-0 scale-[1.01]"
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

            {/* Middle Frame 50 Text Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Left Text — positioned left-side center on mobile for frame 30 */}
                <div
                    ref={middleLeftRef}
                    className="absolute left-10 md:left-20 lg:left-28 xl:left-36 top-[30%] md:top-[40%] -translate-y-1/2 w-[55%] md:w-[32%] max-w-[200px] sm:max-w-[280px] md:max-w-[400px] text-center opacity-0"
                >
                    <p className="text-[17px] sm:text-2xl md:text-3xl font-sans font-normal leading-tight text-black tracking-tight">
                        <SplitText>Turn expertise into growth, retention and influence</SplitText>
                    </p>
                </div>
                {/* Right Text — positioned right-side center on mobile for frame 56 */}
                <div
                    ref={middleRightRef}
                    className="absolute right-10 md:right-20 lg:right-28 xl:right-36 top-[30%] md:top-[50%] -translate-y-1/2 w-[55%] md:w-[32%] max-w-[250px] sm:max-w-[280px] md:max-w-[400px] text-center opacity-0"
                >
                    <p className="text-[17px] sm:text-2xl md:text-3xl font-sans font-normal leading-tight text-black tracking-tight">
                        <SplitText>Connect with more patients with joyzen ecosystem</SplitText>
                    </p>
                </div>
            </div>

            {/* Frame 92 Text Layer — top-centered on mobile for frame 100 */}
            <div
                ref={frame92TextRef}
                className="absolute left-1/2 md:left-20 lg:left-28 xl:left-10 -translate-x-1/2 md:translate-x-0 top-[20%] md:top-[25%] w-[85%] md:w-[45%] max-w-[300px] sm:max-w-[400px] md:max-w-[500px] text-center opacity-0 z-20 pointer-events-none"
            >
                <p className="text-[17px] sm:text-2xl md:text-3xl font-sans font-normal leading-tight text-black tracking-tight">
                    <SplitText>Build lasting patient relationships through continuous care</SplitText>
                </p>
            </div>

            {/* Frame 145 Text Layer — top-centered on mobile for frame 155 */}
            <div
                ref={frame145TextRef}
                className="absolute left-1/2 md:left-auto md:right-20 lg:right-28 xl:right-10 -translate-x-1/2 md:translate-x-0 top-[20%] md:top-[25%] -translate-y-1/2 w-[85%] md:w-[45%] max-w-[300px] sm:max-w-[400px] md:max-w-[500px] text-center opacity-0 z-20 pointer-events-none"
            >
                <p className="text-[17px] sm:text-2xl md:text-3xl font-sans font-normal leading-tight text-black tracking-tight">
                    <SplitText>Great doctors are remembered for the lives they change.</SplitText>
                </p>
            </div>

            {/* Frame 190 Text Layer — right-centered on mobile for frame 210 */}
            <div
                ref={frame190TextRef}
                className="absolute right-4 md:right-20 lg:right-28 xl:right-10 top-1/2 md:top-[25%] -translate-y-1/2 w-[55%] md:w-[45%] max-w-[200px] sm:max-w-[400px] md:max-w-[500px] text-center opacity-0 z-20 pointer-events-none"
            >
                <p className="text-[17px] sm:text-2xl md:text-3xl font-sans font-normal leading-tight text-black tracking-tight">
                    <SplitText>Become a trusted partner throughout every patient journey</SplitText>
                </p>
            </div>

            {/* Frame 212 Text Layer — left-centered on mobile for frame 240 */}
            <div
                ref={frame212TextRef}
                className="absolute left-4 md:left-20 lg:left-28 xl:left-10 top-1/2 md:top-[25%] -translate-y-1/2 w-[55%] md:w-[45%] max-w-[200px] sm:max-w-[400px] md:max-w-[500px] text-center opacity-0 z-20 pointer-events-none"
            >
                <p className="text-[17px] sm:text-2xl md:text-3xl font-sans font-normal leading-tight text-black tracking-tight">
                    <SplitText>Build authority through education, insights, and trust</SplitText>
                </p>
            </div>

            {/* Subtle Progress Bar Overlay while preloading */}
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

            {/* Bottom Blur/Gradient to fade into the next section */}
            <div
                className="absolute bottom-0 left-0 w-full h-10 pointer-events-none z-10"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 100%)'
                }}
            />
        </section>
    );
};

export default DoctorAdvantage;
