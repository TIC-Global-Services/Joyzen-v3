"use client"
import React from 'react'
import Image from 'next/image'
// import bgimage from '@/assets/home?'
const Care = () => {
    return (
        <section id="care" className="relative w-full py-16 md:py-36 flex flex-col items-center min-h-[50vh] md:min-h-screen justify-center text-center overflow-hidden font-satoshi bg-white">
            {/* Background Soft Gradients and Logo */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu" style={{ transform: 'translateZ(0)' }}>
                <div className="absolute -bottom-[5%] -left-[40%] md:left-[-50%] w-[80%] h-[40%] bg-[#b4def7] opacity-80 rounded-[100%] md:blur-[80px] md:block hidden" />
                <div className="absolute -bottom-[5%] -left-[40%] w-[80%] h-[40%] md:hidden block bg-[radial-gradient(circle,rgba(180,222,247,0.8)_0%,transparent_70%)]" />

                <div className="absolute -bottom-[5%] -right-[30%] w-[70%] h-[30%] bg-[#036132] opacity-70 rounded-[100%] md:blur-[80px] md:block hidden" />
                <div className="absolute -bottom-[5%] -right-[30%] w-[70%] h-[30%] md:hidden block bg-[radial-gradient(circle,rgba(3,97,50,0.5)_0%,transparent_70%)]" />

                <div className="absolute -bottom-[20%] right-[20%] md:right-[-10%] w-[80%] h-[30%] bg-[#036132] opacity-50 rounded-[100%] md:blur-[140px] md:block hidden" />
                <div className="absolute -bottom-[20%] right-[20%] w-[80%] h-[30%] md:hidden block bg-[radial-gradient(circle,rgba(3,97,50,0.3)_0%,transparent_70%)]" />
            </div>
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="relative w-[200px] md:w-[800px] h-[500px] md:h-[70dvh] select-none">
                    <Image
                        src="/logo_transparent.svg"
                        alt="Joyzen Logo Watermark"
                        fill
                        className="object-contain "
                        priority
                    />
                </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center">
                <div className="space-y-6 md:space-y-8">
                    <h2 className="text-4xl md:text-5xl lg:text-[3.75rem] font-sans font-medium tracking-tight leading-[44px]">
                        <span className="text-[#036132]">Care</span>, Reimagined Around You
                    </h2>
                    <p className="max-w-2xl mx-auto text-sm md:text-2xl font-epilogue leading-tight font-medium">
                        A new standard in reproductive care – thoughtfully designed to be continuous, deeply personal, and centered entirely around you.
                    </p>
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        </section>
    )
}

export default Care
