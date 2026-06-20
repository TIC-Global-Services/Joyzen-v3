"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import gsap from 'gsap'
import TextReveal from '@/reUseable/TextReveal'

const intakeFormSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters")
        .regex(/^[a-zA-Z]+$/, "Name must contain only alphabets (no numbers or spaces)"),
    specialty: z.string()
        .min(3, "Speciality must be at least 3 characters")
        .regex(/^[a-zA-Z\s]+$/, "Speciality must contain only alphabets and spaces"),
    city: z.string()
        .min(3, "City must be at least 3 characters")
        .regex(/^[a-zA-Z\s]+$/, "City must contain only alphabets and spaces"),
    address: z.string().min(3, "Clinic Address must be at least 3 characters"),
    phone: z.string()
        .min(1, "Phone number is required")
        .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    patientVolume: z.string().optional(),
    comments: z.string().optional(),
})

type IntakeFormData = z.infer<typeof intakeFormSchema>;

const IntakeForm = () => {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<IntakeFormData>({
        resolver: zodResolver(intakeFormSchema),
        mode: "onChange"
    })

    const watchedValues = watch()
    const [focusedIndex, setFocusedIndex] = useState<number>(0)
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [logoTop, setLogoTop] = useState<number | null>(null)
    const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

    const blob1Ref = useRef<HTMLDivElement>(null)
    const blob2Ref = useRef<HTMLDivElement>(null)
    const blob3Ref = useRef<HTMLDivElement>(null)
    const blob4Ref = useRef<HTMLDivElement>(null)

    const getFieldNameByIndex = (index: number): keyof IntakeFormData => {
        const fields: (keyof IntakeFormData)[] = ["name", "specialty", "city", "address", "phone", "email", "patientVolume", "comments"];
        return fields[index];
    };

    const handleFocus = (index: number) => {
        setFocusedIndex(index);
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const updateLogoPosition = useCallback(() => {
        const container = fieldRefs.current[focusedIndex];
        if (container) {
            const inputElement = container.querySelector('input');
            if (inputElement) {
                const top = inputElement.offsetTop + (inputElement.offsetHeight / 2);
                setLogoTop(top);
            }
        }
    }, [focusedIndex]);

    useEffect(() => {
        updateLogoPosition();
        // Delay to allow DOM settles after error changes or resizing
        const timer = setTimeout(updateLogoPosition, 50);

        window.addEventListener('resize', updateLogoPosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateLogoPosition);
        };
    }, [focusedIndex, errors, updateLogoPosition]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5);
            const y = (e.clientY / window.innerHeight - 0.5);

            if (blob1Ref.current?.parentElement) gsap.to(blob1Ref.current.parentElement, { x: x * 350, y: y * 180, duration: 2, ease: "power2.out" });
            if (blob2Ref.current?.parentElement) gsap.to(blob2Ref.current.parentElement, { x: x * -300, y: y * 200, duration: 2, ease: "power2.out" });
            if (blob3Ref.current?.parentElement) gsap.to(blob3Ref.current.parentElement, { x: x * 250, y: y * -150, duration: 2, ease: "power2.out" });
            if (blob4Ref.current?.parentElement) gsap.to(blob4Ref.current.parentElement, { x: x * -200, y: y * -120, duration: 2, ease: "power2.out" });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const onSubmit = async (data: IntakeFormData) => {
        const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbyA4JtUq62yvksXHhICXf5TvVE-G5bOMJ87Qfrr_5aElr1XQ7ubJ3IK6r3FgUi0JrVC/exec";

        try {
            await fetch(ENDPOINT_URL, {
                method: "POST",
                body: JSON.stringify({
                    name: data.name,
                    specialty: data.specialty,
                    city: data.city,
                    address: data.address,
                    phone: data.phone,
                    email: data.email,
                    patientVolume: data.patientVolume,
                    comments: data.comments
                }),
            });

            toast.success("Application submitted successfully! We will be in touch shortly.", {
                style: {
                    background: "#036132",
                    color: "#fff",
                    fontFamily: "var(--font-noria)",
                }
            });
            reset();
        } catch (error) {
            toast.error("Error submitting application. Please try again.", {
                style: {
                    background: "#ef4444",
                    color: "#fff",
                    fontFamily: "var(--font-noria)",
                }
            });
            console.error("Error submitting form:", error);
        }
    };

    return (
        <section id="intake-form" className="relative w-full py-10 md:py-14 px-6 md:px-12 bg-white font-noria overflow-hidden">
            <Toaster position="bottom-right" />

            <div className="relative z-10 max-w-[800px] mx-auto">

                {/* Header */}
                <div className="text-left mb-8">
                    <TextReveal
                        tag="h2"
                        type="words"
                        className="text-2xl md:text-4xl font-medium tracking-tight mb-6 uppercase"
                    >
                        Why This Is The Future
                    </TextReveal>
                    <TextReveal
                        tag="p"
                        type="words"
                        delay={0.15}
                        className="font-satoshi text-lg md:text-lg max-w-3xl leading-[1.2] font-normal"
                    >
                        Healthcare is shifting from treatment to continuous, long-term care. Joyzen is leading this change, starting with reproductive health.
                    </TextReveal>
                </div>

                {/* Form Container with Side Logo */}
                <div className="relative w-full">

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-3.5 font-satoshi pr-12 md:pr-16">

                        {/* Doctor/Clinic Name */}
                        <div ref={(el) => { fieldRefs.current[0] = el; }} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Doctor/Clinic Name"
                                {...register("name")}
                                onFocus={() => handleFocus(0)}
                                onBlur={handleBlur}
                                className={`w-full py-3.5 px-6 rounded-full backdrop-blur-sm border-[0.5px] focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.name ? 'border-red-300 focus:border-red-400' : 'border-white/30 focus:border-[#036132]/30'
                                    }`}
                            />
                            {errors.name && <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.name.message}</span>}
                        </div>

                        {/* Speciality */}
                        <div ref={(el) => { fieldRefs.current[1] = el; }} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Speciality"
                                {...register("specialty")}
                                onFocus={() => handleFocus(1)}
                                onBlur={handleBlur}
                                className={`w-full py-3.5 px-6 rounded-full backdrop-blur-sm border-[0.5px] focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.specialty ? 'border-red-300 focus:border-red-400' : 'border-white/30 focus:border-[#036132]/30'
                                    }`}
                            />
                            {errors.specialty && <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.specialty.message}</span>}
                        </div>

                        {/* City */}
                        <div ref={(el) => { fieldRefs.current[2] = el; }} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="City"
                                {...register("city")}
                                onFocus={() => handleFocus(2)}
                                onBlur={handleBlur}
                                className={`w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border-[0.75px] focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.city ? 'border-red-300 focus:border-red-400' : 'border-white/30 focus:border-[#036132]/30'
                                    }`}
                            />
                            {errors.city && <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.city.message}</span>}
                        </div>

                        {/* Clinic Address */}
                        <div ref={(el) => { fieldRefs.current[3] = el; }} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Clinic Address"
                                {...register("address")}
                                onFocus={() => handleFocus(3)}
                                onBlur={handleBlur}
                                className={`w-full py-3.5 px-6 rounded-full backdrop-blur-sm border-[0.75px] focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.address ? 'border-red-300 focus:border-red-400' : 'border-white/30 focus:border-[#036132]/30'
                                    }`}
                            />
                            {errors.address && <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.address.message}</span>}
                        </div>

                        {/* Phone Number */}
                        <div ref={(el) => { fieldRefs.current[4] = el; }} className="flex flex-col">
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                maxLength={10}
                                {...register("phone", {
                                    onChange: (e) => {
                                        e.target.value = e.target.value.replace(/\D/g, '');
                                    }
                                })}
                                onFocus={() => handleFocus(4)}
                                onBlur={handleBlur}
                                className={`w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border-[0.75px] focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.phone ? 'border-red-300 focus:border-red-400' : 'border-white/30 focus:border-[#036132]/30'
                                    }`}
                            />
                            {errors.phone && <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.phone.message}</span>}
                        </div>

                        {/* Email */}
                        <div ref={(el) => { fieldRefs.current[5] = el; }} className="flex flex-col">
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                onFocus={() => handleFocus(5)}
                                onBlur={handleBlur}
                                className={`w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border-[0.75px] focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-white/30 focus:border-[#036132]/30'
                                    }`}
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.email.message}</span>}
                        </div>

                        {/* Current monthly patient volume */}
                        <div ref={(el) => { fieldRefs.current[6] = el; }} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Current monthly patient volume"
                                {...register("patientVolume")}
                                onFocus={() => handleFocus(6)}
                                onBlur={handleBlur}
                                className="w-full py-3.5 px-6 rounded-full backdrop-blur-sm border-[0.75px] border-white/30 focus:outline-none focus:border-[#036132]/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base"
                            />
                        </div>

                        {/* Why do you want to partner with Joyzen? */}
                        <div ref={(el) => { fieldRefs.current[7] = el; }} className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Why do you want to partner with Joyzen?"
                                {...register("comments")}
                                onFocus={() => handleFocus(7)}
                                onBlur={handleBlur}
                                className="w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border-[0.75px] border-white/30 focus:outline-none focus:border-[#036132]/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center md:justify-end pt-2 font-noria">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group px-8 py-3 rounded-full backdrop-blur-sm border-[0.75px] border-white/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 text-sm md:text-base font-medium hover:border-[#036132]/30 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Partnership Application

                                    </>
                                )}
                            </button>
                        </div>

                        <div
                            className={`absolute right-0 pointer-events-none z-20 transition-all duration-500 ease-out ${logoTop === null ? 'opacity-0' : 'opacity-60'
                                }`}
                            style={{
                                top: logoTop !== null ? `${logoTop}px` : '28px',
                                transform: isFocused
                                    ? `translateY(-50%) translateY(-10px) scale(1.15) rotate(${watchedValues &&
                                        watchedValues[getFieldNameByIndex(focusedIndex)] &&
                                        String(watchedValues[getFieldNameByIndex(focusedIndex)]).length > 0
                                        ? '8deg'
                                        : '0deg'
                                    })`
                                    : 'translateY(-50%) scale(1) rotate(0deg)',
                            }}
                        >
                            <div className="relative w-8 h-12 md:w-10 md:h-14 transition-all duration-300">
                                <svg width="100%" height="100%" viewBox="0 0 134 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M55.9273 93.8987C25.6612 93.8987 5.99071 80.9128 0 57.1953L133.333 57.2785V93.8987H55.9273Z" fill="#EF8F60" />
                                    <path d="M66.476 44.9891C54.1905 44.9891 43.8145 34.7734 43.8145 22.6859C43.8145 10.5984 54.1989 0 66.476 0C78.7532 0 89.5179 10.1741 89.5179 22.6859C89.5179 35.1977 78.9644 44.9891 66.476 44.9891Z" fill="#EF8F60" />
                                    <path d="M0 142.727V106.106H77.406C107.672 106.106 127.343 119.092 133.333 142.81L0 142.727Z" fill="#EF8F60" />
                                    <path d="M66.8573 200C54.1492 200 43.8154 189.826 43.8154 177.314C43.8154 164.802 54.3689 155.011 66.8573 155.011C79.3456 155.011 89.5104 165.226 89.5104 177.314C89.5104 189.401 79.1344 200 66.8573 200Z" fill="#EF8F60" />
                                </svg>
                            </div>
                        </div>

                    </form>

                </div>

            </div>

            {/* Interactive Mesh Gradient Background at the bottom */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden flex items-end">
                <div className="relative w-full h-[45vh] opacity-90 select-none">
                    {/* Icy Blue (Bottom Left / Side) */}
                    <div className="absolute inset-0">
                        <div className="absolute top-[30%] -translate-y-1/2 left-[-10%] w-[45vw] h-[35vw]">
                            <div ref={blob1Ref} className="w-full h-full bg-[#BAE6FD] rounded-full filter blur-[60px] md:blur-[100px] opacity-70" />
                        </div>
                    </div>
                    {/* Purple (Bottom Right / Side) */}
                    <div className="absolute inset-0">
                        <div className="absolute top-[30%] -translate-y-1/2 right-[-10%] w-[40vw] h-[35vw]">
                            <div ref={blob2Ref} className="w-full h-full bg-[#E9D5FF] rounded-full filter blur-[60px] md:blur-[100px] opacity-70" />
                        </div>
                    </div>
                    {/* Orange (Bottom Left/Center) */}
                    <div className="absolute inset-0">
                        <div className="absolute top-[70%] -translate-y-1/2 left-[5%] w-[55vw] h-[25vw]">
                            <div ref={blob3Ref} className="w-full h-full bg-[#EF8F60] rounded-full filter blur-[85px] md:blur-[100px] opacity-70" />
                        </div>
                    </div>
                    {/* Yellow (Bottom Right/Center) */}
                    <div className="absolute inset-0">
                        <div className="absolute top-[80%] -translate-y-1/2 right-[0%] w-[70vw] h-[15vw]">
                            <div ref={blob4Ref} className="w-full h-full bg-[#FCE883] rounded-full filter blur-[85px] md:blur-[100px] opacity-70" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom White Blend Gradient to transition into Footer */}
            <div 
                className="absolute bottom-0 left-0 w-full h-[180px] pointer-events-none z-0"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)'
                }}
            />
        </section>
    )
}

export default IntakeForm
