/**
 * lib/gsap.ts
 * Central GSAP initialization — registers all plugins once.
 * Import gsap and ScrollTrigger from here instead of directly from 'gsap'.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
