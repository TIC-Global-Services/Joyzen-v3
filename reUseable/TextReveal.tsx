"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JoyzenLogo from "./JoyzenLogo";
// import JoyzenLogo from "@/components/JoyzenLogo";

gsap.registerPlugin(ScrollTrigger);

const TEXT_CONTENT = [
  { text: "Joyzen", isOrange: true },
  { text: " replaces fragmented care with a continuous system where hormones, fertility, and long-term health are managed together. Online or in clinic, it's the same person guiding your care. Tracking your progress." },
  { text: " Adjusting your treatment. Moving you forward.", isLight: true },
  { text: " Joyzen connects you to the right doctor and keeps your care continuous across every step. Always accessible speak to your doctor anytime not just during appointment.", isLight: true },
];

const FEATURES = [
  {
    title: "Beyond Visits",
    description:
      "Traditional care treats moments. Joyzen manages the entire journey continuously, not occasionally.",
    type: "text" as const,
  },
  {
    title: "Integrated Care",
    description:
      "Doctors, lifestyle, and emotional support, working together as one system.",
    type: "text" as const,
  },
  {
    image: "/images/consultation-care.png",
    alt: "Doctor consultation with patient",
    type: "image" as const,
  },
  {
    title: "Focused on Root, Not Symptoms",
    description:
      "Hormones, lifestyle, fertility, long-term health, everything connected, everything managed.",
    type: "text" as const,
  },
  {
    image: "/images/nurse-consultation.png",
    alt: "Nurse consulting with patient",
    type: "image" as const,
  },
  {
    title: "Designed for Better Outcomes",
    description:
      "Not more visits. Not more confusion. Clear direction. Continuous support. Real results.",
    type: "text" as const,
  },
];

const DESKTOP_SLOT_CLASSES = [
  "md:col-start-1 md:col-span-4 md:row-start-1",
  "md:col-start-5 md:col-span-4 md:row-start-1",
  "md:col-start-9 md:col-span-4 md:row-start-1",
  "md:col-start-1 md:col-span-4 md:row-start-2 md:row-span-2",
  "md:col-start-5 md:col-span-4 md:row-start-3",
  "md:col-start-9 md:col-span-4 md:row-start-2 md:row-span-2",
] as const;

export default function TextReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const joyzenRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = Array.from(
        textRef.current?.querySelectorAll<HTMLElement>(".text-word") ?? []
      );
      if (!words.length) return;

      const orangeWords = words.filter((word) =>
        word.classList.contains("orange-text")
      );
      const regularWords = words.filter(
        (word) => !word.classList.contains("orange-text")
      );

      gsap.set(regularWords, {
        color: "#bbb6ae",
        opacity: 0.24,
      });

      gsap.set(orangeWords, {
        color: "#f19060",
        opacity: 1,
      });

      gsap.set(joyzenRef.current, {
        opacity: 0,
        y: 22,
        scale: 0.98,
      });

      gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.94,
      });

      const cards = cardsRef.current.filter(
        (card): card is HTMLDivElement => card !== null
      );
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const setCardsFromLogoOrigin = () => {
        const logoBounds = logoRef.current?.getBoundingClientRect();
        const stageBounds = stageRef.current?.getBoundingClientRect();

        const originX = logoBounds
          ? logoBounds.left + logoBounds.width / 2
          : stageBounds
            ? stageBounds.left + stageBounds.width / 2
            : window.innerWidth / 2;

        const originY = logoBounds
          ? logoBounds.top + logoBounds.height / 2
          : stageBounds
            ? stageBounds.top + stageBounds.height / 2
            : window.innerHeight / 2;

        cards.forEach((card) => {
          const cardBounds = card.getBoundingClientRect();
          const cardCenterX = cardBounds.left + cardBounds.width / 2;
          const cardCenterY = cardBounds.top + cardBounds.height / 2;

          gsap.set(card, {
            opacity: 0,
            scale: isMobile ? 0.78 : 0.72,
            filter: "blur(10px)",
            x: originX - cardCenterX,
            y: originY - cardCenterY,
          });
        });
      };

      setCardsFromLogoOrigin();

      // Magnetic Hover Physics
      const cleanups: (() => void)[] = [];
      if (!isMobile) {
        cards.forEach((card) => {
          gsap.set(card, { transformPerspective: 1000, rotateX: 0, rotateY: 0 });
          const xTo = gsap.quickTo(card, "rotateY", { ease: "power3.out", duration: 0.5 });
          const yTo = gsap.quickTo(card, "rotateX", { ease: "power3.out", duration: 0.5 });
          const glowXTo = gsap.quickTo(card, "--x", { ease: "power3.out", duration: 0.2 });
          const glowYTo = gsap.quickTo(card, "--y", { ease: "power3.out", duration: 0.2 });
          const opacityTo = gsap.quickTo(card, "--opacity", { ease: "power3.out", duration: 0.5 });

          const onMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt (max 6 degrees)
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            xTo(rotateY);
            yTo(rotateX);
            glowXTo(x);
            glowYTo(y);
            opacityTo(1);
          };

          const onMouseLeave = () => {
            xTo(0);
            yTo(0);
            opacityTo(0);
          };

          card.addEventListener("mousemove", onMouseMove);
          card.addEventListener("mouseleave", onMouseLeave);

          cleanups.push(() => {
            card.removeEventListener("mousemove", onMouseMove);
            card.removeEventListener("mouseleave", onMouseLeave);
          });
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: stageRef.current,
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: setCardsFromLogoOrigin,
        },
      });

      tl.fromTo(
        textRef.current,
        { y: 36, opacity: 0.75 },
        { y: 0, opacity: 1, duration: 0.35, ease: "none" }
      )
        .to(
          regularWords,
          {
            color: "#111827",
            opacity: 1,
            stagger: 0.045,
            duration: 0.55,
            ease: "none",
          }
        )
        .to(
          orangeWords,
          {
            color: "#f19060",
            opacity: 1,
            duration: 0.2,
            ease: "none",
          },
          "<"
        )
        .to(
          {},
          {
            duration: 1.0,
          }
        )
        .to(
          textRef.current,
          {
            opacity: 0,
            y: -20,
            duration: 0.55,
            ease: "none",
          }
        )
        .to(
          joyzenRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            ease: "none",
          }
        )
        .to(
          {},
          {
            duration: 0.38,
          }
        )
        .to(
          joyzenRef.current,
          {
            opacity: 0,
            y: 22,
            scale: 0.98,
            duration: 0.62,
            ease: "none",
          }
        )
        .to(
          logoRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.72,
            ease: "none",
          }
        )
        .fromTo(
          cards,
          {
            x: (i, target) => {
              const cardBounds = target.getBoundingClientRect();
              const cardCenterX = cardBounds.left + cardBounds.width / 2;
              const cardCenterY = cardBounds.top + cardBounds.height / 2;
              const logoBounds = logoRef.current?.getBoundingClientRect();
              const originX = logoBounds ? logoBounds.left + logoBounds.width / 2 : window.innerWidth / 2;
              const originY = logoBounds ? logoBounds.top + logoBounds.height / 2 : window.innerHeight / 2;
              return originX - cardCenterX;
            },
            y: (i, target) => {
              const cardBounds = target.getBoundingClientRect();
              const cardCenterY = cardBounds.top + cardBounds.height / 2;
              const logoBounds = logoRef.current?.getBoundingClientRect();
              const originY = logoBounds ? logoBounds.top + logoBounds.height / 2 : window.innerHeight / 2;
              return originY - cardCenterY;
            },
            opacity: 0,
            scale: isMobile ? 0.78 : 0.72,
            filter: "blur(10px)",
          },
          {
            x: 0,
            y: (i) => (isMobile ? i * 16 : 0),
            opacity: 1,
            scale: (i) => (isMobile ? 1 - i * 0.05 : 1),
            filter: "blur(0px)",
            duration: 1.05,
            stagger: 0.06,
            ease: "none",
          },
          ">+0.12"
        );

      if (isMobile) {
        cards.forEach((card, i) => {
          if (i < cards.length - 1) {
            tl.to(card, {
              y: -window.innerHeight * 0.65,
              opacity: 0,
              scale: 0.9,
              duration: 1.2,
              ease: "power2.inOut",
            });
            const remainingCards = cards.slice(i + 1);
            tl.to(
              remainingCards,
              {
                y: (j) => j * 16,
                scale: (j) => 1 - j * 0.05,
                duration: 1.2,
                ease: "power2.inOut",
              },
              "<"
            );
          }
        });
        tl.to({}, { duration: 0.5 });
      } else {
        tl.to({}, { duration: 0.8 });
      }

      return () => cleanups.forEach((fn) => fn());
    }, stageRef);

    return () => ctx.revert();
  }, []);

  // Build the word spans
  const renderText = () => {
    const allWords: { word: string; isOrange: boolean }[] = [];

    TEXT_CONTENT.forEach((segment) => {
      const words = segment.text.split(/(\s+)/);
      words.forEach((word) => {
        if (word.trim()) {
          allWords.push({
            word,
            isOrange: segment.isOrange ?? false,
          });
        } else if (word) {
          allWords.push({ word, isOrange: false });
        }
      });
    });

    return allWords.map((item, idx) => {
      if (!item.word.trim()) {
        return <span key={idx}> </span>;
      }
      return (
        <span
          key={idx}
          className={`text-word inline ${item.isOrange ? "orange-text" : ""}`}
        >
          {item.word}{" "}
        </span>
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-[700vh] bg-[#fbf8f2] gradient-pastel md:h-[620vh]"
    >
      <div
        ref={stageRef}
        className="flex min-h-[100svh] items-start md:min-h-screen md:items-center"
      >
        <div className="absolute inset-0 bg-[#fbf8f2]" />
        <div className="absolute inset-0 gradient-pastel opacity-50 md:opacity-80" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1280px] items-center px-4 sm:px-6 md:min-h-screen md:px-10">
          <div
            ref={textRef}
            className="mx-auto max-w-[1100px] text-center text-[clamp(1.45rem,5.4vw,2.8rem)] leading-[1.18] font-medium tracking-tight sm:leading-[1.15] md:text-[clamp(2rem,3vw,4rem)]"
          >
            {renderText()}
          </div>

          <div
            ref={joyzenRef}
            className="absolute inset-x-4 top-[46%] z-20 -translate-y-1/2 sm:inset-x-6 md:inset-x-10 md:top-1/2"
          >
            <p className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-7xl">
              This is <span style={{ color: "#f19060" }}>Joyzen</span>
            </p>
          </div>

          <div
            ref={logoRef}
            className="absolute inset-x-4 top-[23%] z-20 flex -translate-y-1/2 justify-center sm:inset-x-6 md:top-1/2 md:inset-x-10"
          >
            <JoyzenLogo
              className="w-[150px] sm:w-[180px] md:w-[340px]"
              sizes="(max-width: 639px) 150px, (max-width: 767px) 180px, 340px"
            />
          </div>

          <div
            id="programs"
            className="pointer-events-none absolute inset-0 z-10 flex flex-col pt-[38vh] sm:pt-[36vh] items-center md:justify-center md:pt-0"
          >
            <div className="pointer-events-auto w-full px-4 sm:px-6 grid grid-cols-1 grid-rows-1 md:grid-cols-12 md:grid-rows-[minmax(250px,_1fr)_116px_minmax(235px,_1fr)] md:gap-x-5 md:gap-y-5 md:px-10 md:pb-0">
              {FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  style={{ zIndex: FEATURES.length - idx }}
                  className={`bento-card col-start-1 row-start-1 mx-auto w-full max-w-[24rem] md:mx-0 md:w-auto md:max-w-none rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] md:shadow-none ${DESKTOP_SLOT_CLASSES[idx]} ${feature.type === "text"
                    ? "glass-card bg-white/95 flex min-h-[228px] flex-col justify-end p-5 sm:min-h-[248px] sm:p-6 md:min-h-[260px] md:p-8 relative"
                    : "glass-card min-h-[228px] p-1.5 sm:min-h-[248px] md:min-h-[260px]"
                    }`}
                >
                  <span aria-hidden className="bento-glow" />
                  {feature.type === "text" ? (
                    <>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl md:mb-3 md:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-tight text-slate-700 md:text-base">
                        {feature.description}
                      </p>
                    </>
                  ) : (
                    <div className="relative h-full min-h-[200px] w-full overflow-hidden rounded-[1rem] sm:min-h-[220px] sm:rounded-[1.2rem] md:min-h-[220px] md:rounded-[1.55rem]">
                      <Image
                        src={feature.image!}
                        alt={feature.alt!}
                        fill
                        className="object-cover"
                        sizes="(max-width: 767px) 80vw, 33vw"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
