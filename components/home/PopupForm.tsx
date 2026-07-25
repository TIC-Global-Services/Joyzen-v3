"use client"
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'

const popupSchema = z.object({
    doctorName: z.string().min(2, "Doctor name must be at least 2 characters"),
    clinic: z.string().min(2, "Clinic/Hospital must be at least 2 characters"),
    specialty: z.string().min(2, "Speciality must be at least 2 characters"),
    reason: z.string().min(2, "Please tell us what made you land on the website"),
})

export type PopupFormData = z.infer<typeof popupSchema>

interface PopupFormProps {
    isOpen: boolean
    onClose: () => void
}

const PopupForm = ({ isOpen, onClose }: PopupFormProps) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PopupFormData>({
        resolver: zodResolver(popupSchema),
        mode: "onBlur",
    })

    const inputClass = (hasError: boolean) =>
        `w-full py-3.5 px-6 rounded-full bg-white/10 border-[0.5px] focus:outline-none transition-[border-color,box-shadow] duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 placeholder-[#6E6E6E] text-base ${hasError ? 'border-red-300 focus:border-red-400' : 'border-white/30 focus:border-[#036132]/30'
        }`

    const onSubmit = async (data: PopupFormData) => {
        const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbxoTZQTNxI-eNNnUU9b455petbSxiuysm2N9D8gavG2Vav_URjgALVHL0YFRYMWbENB/exec"

        try {
            await fetch(ENDPOINT_URL, {
                method: "POST",
                body: JSON.stringify({
                    name: data.doctorName,
                    clinic: data.clinic,
                    specialty: data.specialty,
                    reason: data.reason,
                }),
            })

            toast.success("Submitted successfully!", {
                style: {
                    background: "#036132",
                    color: "#fff",
                    fontFamily: "var(--font-noria)",
                },
            })
            reset()
            onClose()
        } catch {
            toast.error("Error submitting. Please try again.", {
                style: {
                    background: "#ef4444",
                    color: "#fff",
                    fontFamily: "var(--font-noria)",
                },
            })
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleEscape)
        }
        return () => window.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <Toaster position="bottom-right" />

            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className="relative w-full max-w-lg bg-white/50 backdrop-blur-xl rounded-2xl shadow-2xl animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/50 border border-white/30 text-gray-500 hover:text-gray-800 hover:bg-white transition-all duration-200 cursor-pointer"
                >
                    <X size={18} />
                </button>

                <div className="p-8 md:p-10">
                    <h2 className="font-noria text-2xl md:text-3xl font-medium tracking-tight mb-6">
                        Quick Enquiry
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 font-satoshi">
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Doctor Name"
                                {...register("doctorName")}
                                className={inputClass(!!errors.doctorName)}
                            />
                            {errors.doctorName && (
                                <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.doctorName.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Clinic / Hospital"
                                {...register("clinic")}
                                className={inputClass(!!errors.clinic)}
                            />
                            {errors.clinic && (
                                <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.clinic.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Speciality"
                                {...register("specialty")}
                                className={inputClass(!!errors.specialty)}
                            />
                            {errors.specialty && (
                                <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.specialty.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="What made you land on the website?"
                                {...register("reason")}
                                className={inputClass(!!errors.reason)}
                            />
                            {errors.reason && (
                                <span className="text-red-500 text-xs mt-1.5 pl-6">{errors.reason.message}</span>
                            )}
                        </div>

                        <div className="flex justify-center pt-2 font-noria">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group px-8 py-3 rounded-full bg-white/10 border-[0.75px] border-white/30 transition-all duration-300 shadow-[8px_8px_16px_rgba(0,0,0,0.04),inset_3px_3px_8px_rgba(0,0,0,0.05)] text-gray-800 text-sm md:text-base font-medium hover:border-[#036132]/30 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PopupForm
