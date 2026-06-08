"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'

interface IntakeFormData {
    name: string;          // Doctor/Clinic Name
    specialty: string;     // Speciality
    city: string;          // City
    address: string;       // Clinic Address
    phone: string;         // Phone Number
    email: string;         // Email
    patientVolume: string; // Current monthly patient volume
    comments: string;      // Why do you want to partner with Joyzen?
}

const IntakeForm = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IntakeFormData>()

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
                    fontFamily: "var(--font-satoshi)",
                }
            });
            reset();
        } catch (error) {
            toast.error("Error submitting application. Please try again.", {
                style: {
                    background: "#ef4444",
                    color: "#fff",
                    fontFamily: "var(--font-satoshi)",
                }
            });
            console.error("Error submitting form:", error);
        }
    };

    return (
        <section id="intake-form" className="relative w-full py-16 md:py-24 px-6 md:px-12 bg-white font-satoshi overflow-hidden">
            <Toaster position="bottom-right" />

            <div className="max-w-[800px] mx-auto">

                {/* Header */}
                <div className="text-left mb-8">
                    <h2 className="text-2xl md:text-4xl font-medium tracking-tight mb-6">
                        Why This Is The Future
                    </h2>
                    <p className="font-epilogue text-lg md:text-lg max-w-3xl leading-[1.2] font-normal">
                        Healthcare is shifting from reactive treatment to continuous, preventive care. Moving beyond isolated visits and short-term fixes, Joyzen is building a connected healthcare system that supports long-term outcomes through ongoing care, technology, and patient engagement, starting with reproductive health.
                    </p>
                </div>

                {/* Form Container with Watermark */}
                <div className="relative w-full">

                    {/* Faded Orange Logo Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none opacity-[0.20]">
                        <div className="relative w-[240px] h-[360px] md:w-[280px] md:h-[420px]">
                            <svg width="100%" height="100%" viewBox="0 0 134 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M55.9273 93.8987C25.6612 93.8987 5.99071 80.9128 0 57.1953L133.333 57.2785V93.8987H55.9273Z" fill="#EF8F60" />
                                <path d="M66.476 44.9891C54.1905 44.9891 43.8145 34.7734 43.8145 22.6859C43.8145 10.5984 54.1989 0 66.476 0C78.7532 0 89.5179 10.1741 89.5179 22.6859C89.5179 35.1977 78.9644 44.9891 66.476 44.9891Z" fill="#EF8F60" />
                                <path d="M0 142.727V106.106H77.406C107.672 106.106 127.343 119.092 133.333 142.81L0 142.727Z" fill="#EF8F60" />
                                <path d="M66.8573 200C54.1492 200 43.8154 189.826 43.8154 177.314C43.8154 164.802 54.3689 155.011 66.8573 155.011C79.3456 155.011 89.5104 165.226 89.5104 177.314C89.5104 189.401 79.1344 200 66.8573 200Z" fill="#EF8F60" />
                            </svg>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-3.5">

                        {/* Doctor/Clinic Name */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Doctor/Clinic Name"
                                {...register("name", { required: "Name is required" })}
                                className={`w-full py-3.5 px-6 rounded-full backdrop-blur-sm border focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#036132]/30'
                                    }`}
                            />
                        </div>

                        {/* Speciality */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Speciality"
                                {...register("specialty", { required: "Speciality is required" })}
                                className={`w-full py-3.5 px-6 rounded-full backdrop-blur-sm border focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.specialty ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#036132]/30'
                                    }`}
                            />
                        </div>

                        {/* City */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="City"
                                {...register("city", { required: "City is required" })}
                                className={`w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.city ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#036132]/30'
                                    }`}
                            />
                        </div>

                        {/* Clinic Address */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Clinic Address"
                                {...register("address")}
                                className="w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border border-gray-100 focus:outline-none focus:border-[#036132]/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col">
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                {...register("phone", { required: "Phone number is required" })}
                                className={`w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.phone ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#036132]/30'
                                    }`}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                                className={`w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border focus:outline-none transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-[#036132]/30'
                                    }`}
                            />
                        </div>

                        {/* Current monthly patient volume */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Current monthly patient volume"
                                {...register("patientVolume")}
                                className="w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border border-gray-100 focus:outline-none focus:border-[#036132]/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base"
                            />
                        </div>

                        {/* Why do you want to partner with Joyzen? */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Why do you want to partner with Joyzen?"
                                {...register("comments")}
                                className="w-full py-3.5 px-6 rounded-full  backdrop-blur-sm border border-gray-100 focus:outline-none focus:border-[#036132]/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-sm md:text-base"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center md:justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group text-sm md:text-base bg-[#1A1A1A] text-white hover:bg-[#036132] transition-all duration-300 tracking-tight px-8 py-3 rounded-full font-medium shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
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

                    </form>

                </div>

            </div>
        </section>
    )
}

export default IntakeForm
