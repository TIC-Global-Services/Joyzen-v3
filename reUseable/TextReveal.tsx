"use client"
import React, { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  type?: 'words' | 'lines';
  blur?: boolean;
  delay?: number;
  duration?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  manual?: boolean;
  active?: boolean;
}

const splitReactChildrenIntoWords = (children: React.ReactNode, blur: boolean): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      const words = child.split(' ');
      return words.map((word, i) => {
        if (word === '') return null;
        return (
          <span
            key={i}
            className="reveal-word reveal-item inline-block mr-[0.25em]"
            style={{
              opacity: 0,
              filter: blur ? 'blur(10px)' : 'none',
              transform: 'translateY(10px)'
            }}
          >
            {word}
          </span>
        );
      });
    }
    
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<any>;
      const nestedChildren = splitReactChildrenIntoWords(element.props.children, blur);
      return React.cloneElement(element, {
        ...element.props,
        children: nestedChildren
      });
    }
    
    return child;
  });
};

export default function TextReveal({
  children,
  className = '',
  type = 'words',
  blur = true,
  delay = 0,
  duration = 0.8,
  tag: Tag = 'p',
  manual = false,
  active
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);
  const activeAnimationRef = useRef<gsap.core.Timeline | null>(null);

  // 1. Automatic ScrollTrigger Animation (when manual is false)
  useEffect(() => {
    if (!containerRef.current || manual) return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    let ctx: gsap.Context;

    const initScrollTrigger = () => {
      if (ctx) ctx.revert();
      
      const words = container.querySelectorAll('.reveal-word');

      if (words.length > 0) {
        // Group words by offsetTop to identify lines dynamically
        const lineGroups: HTMLElement[][] = [];
        let currentLineTop = -9999;
        let currentLineIndex = -1;

        words.forEach((word) => {
          const el = word as HTMLElement;
          const top = el.offsetTop;
          
          if (Math.abs(top - currentLineTop) > 6) {
            currentLineTop = top;
            currentLineIndex++;
            lineGroups[currentLineIndex] = [];
          }
          lineGroups[currentLineIndex].push(el);
        });

        const triggerEl = container.closest('.pin-spacer') || container;

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: triggerEl,
              start: 'top 95%',
              end: 'bottom 5%',
              toggleActions: 'play reverse play reverse',
            }
          });

          // Animate line by line
          lineGroups.forEach((lineWords, lineIdx) => {
            tl.fromTo(lineWords,
              {
                opacity: 0,
                y: type === 'words' ? 10 : 15,
                filter: blur ? 'blur(10px)' : 'blur(0px)',
                willChange: 'transform, opacity, filter'
              },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: duration,
                delay: delay,
                stagger: type === 'words' ? 0.015 : 0,
                ease: 'power2.out',
                onComplete: () => {
                  lineWords.forEach((el) => {
                    (el as HTMLElement).style.willChange = 'auto';
                  });
                }
              },
              lineIdx * (type === 'words' ? 0.06 : 0.08)
            );
          });
        });
      } else {
        const triggerEl = container.closest('.pin-spacer') || container;
        ctx = gsap.context(() => {
          gsap.fromTo(container,
            {
              opacity: 0,
              filter: blur ? 'blur(10px)' : 'blur(0px)'
            },
            {
              opacity: 1,
              filter: 'blur(0px)',
              duration: duration,
              delay: delay,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: triggerEl,
                start: 'top 95%',
                end: 'bottom 5%',
                toggleActions: 'play reverse play reverse',
              }
            }
          );
        });
      }
    };

    // Delay GSAP initialization slightly so parent pinned ScrollTriggers compile first
    const timer = setTimeout(initScrollTrigger, 100);

    let lastWidth = window.innerWidth;
    const ro = new ResizeObserver(() => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        initScrollTrigger();
      }
    });
    ro.observe(document.documentElement);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      if (ctx) ctx.revert();
    };
  }, [type, blur, delay, duration, manual, children]);

  // 2. Manual Control Animation (when manual is true and active prop changes)
  useEffect(() => {
    if (!containerRef.current || !manual || active === undefined) return;

    const container = containerRef.current;
    const words = container.querySelectorAll('.reveal-word');

    if (words.length > 0) {
      // Group words by offsetTop to identify lines dynamically
      const lineGroups: HTMLElement[][] = [];
      let currentLineTop = -9999;
      let currentLineIndex = -1;

      words.forEach((word) => {
        const el = word as HTMLElement;
        const top = el.offsetTop;
        
        if (Math.abs(top - currentLineTop) > 6) {
          currentLineTop = top;
          currentLineIndex++;
          lineGroups[currentLineIndex] = [];
        }
        lineGroups[currentLineIndex].push(el);
      });

      if (activeAnimationRef.current) {
        activeAnimationRef.current.kill();
      }

      const tl = gsap.timeline();
      activeAnimationRef.current = tl;

      if (active) {
        // Play reveal animation line-by-line
        lineGroups.forEach((lineWords, lineIdx) => {
          tl.fromTo(lineWords,
            {
              opacity: 0,
              y: type === 'words' ? 10 : 15,
              filter: blur ? 'blur(10px)' : 'blur(0px)'
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: duration,
              delay: delay,
              stagger: type === 'words' ? 0.015 : 0,
              ease: 'power2.out'
            },
            lineIdx * (type === 'words' ? 0.06 : 0.08)
          );
        });
      } else {
        if (isFirstRender.current) {
          // Immediately hide/blur
          gsap.set(words, {
            opacity: 0,
            y: type === 'words' ? 10 : 15,
            filter: blur ? 'blur(10px)' : 'blur(0px)'
          });
        } else {
          // Animate hide/blur
          tl.to(words, {
            opacity: 0,
            y: type === 'words' ? 10 : 15,
            filter: blur ? 'blur(10px)' : 'blur(0px)',
            duration: 0.3,
            ease: 'power2.in'
          });
        }
      }
    }

    isFirstRender.current = false;

    return () => {
      if (activeAnimationRef.current) {
        activeAnimationRef.current.kill();
      }
    };
  }, [active, manual, type, blur, delay, duration]);

  // Handle manual resizing for manual mode (to reset offsetTop line wraps)
  useEffect(() => {
    if (!containerRef.current || !manual || active === undefined) return;

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        if (activeAnimationRef.current) {
          activeAnimationRef.current.progress(active ? 1 : 0);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [active, manual]);

  const splitChildren = splitReactChildrenIntoWords(children, blur);
  const isCentered = className.includes('justify-center') || className.includes('text-center');

  return (
    <Tag
      ref={containerRef as any}
      className={`${className} ${isCentered ? 'text-center' : ''}`}
    >
      {splitChildren}
    </Tag>
  );
}
