"use client"
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface TextSegment {
    text: string
    className?: string
}

interface TextScrollRevealProps {
    text?: string
    segments?: TextSegment[]
    className?: string
    start?: string | (() => string)
    end?: string | (() => string)
}

const TextScrollReveal = ({ text, segments, className, start, end }: TextScrollRevealProps) => {
    const containerRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const container = containerRef.current;
        if (!container) return;

        // Clear existing content
        container.innerHTML = "";

        const allSegments = segments || (text ? [{ text }] : []);

        allSegments.forEach((segment) => {
            const words = segment.text.split(" ");
            words.forEach((word) => {
                if (word === "<br/>" || word === "<br>") {
                    const br = document.createElement("br");
                    container.appendChild(br);
                } else if (word !== "") {
                    const span = document.createElement("span");
                    span.className = `opacity-20 inline-block mr-[0.2em] transition-opacity duration-300 ${segment.className || ""}`;
                    span.textContent = word;
                    container.appendChild(document.createTextNode(" "));
                    container.appendChild(span);
                }
            });
        });

        const spans = container.querySelectorAll("span");

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: start || (() => window.innerWidth < 768 ? "top 95%" : "top 80%"),
                end: end || (() => window.innerWidth < 768 ? "bottom 60%" : "bottom 40%"),
                scrub: 0.5,
                invalidateOnRefresh: true,
            }
        });

        tl.to(spans, {
            opacity: 1,
            stagger: 0.1,
            ease: "none"
        });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, [text, JSON.stringify(segments), start, end]);

    return (
        <p
            ref={containerRef}
            className={`${className} leading-tight whitespace-pre-line`}
            suppressHydrationWarning
        >
            {text}
        </p>
    )
}

export default TextScrollReveal
