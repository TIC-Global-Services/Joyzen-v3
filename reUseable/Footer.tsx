import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative w-full h-[50svh] sm:h-[60svh] lg:h-[80svh] bg-gradient-to-r from-[#EBF3F8] via-[#D1E0EC] to-[#A9BFCF] flex flex-col justify-between p-8 sm:p-10 lg:p-[4rem] overflow-hidden">
      {/* Top row */}
      <div className="flex justify-center sm:justify-end gap-6 sm:gap-12 text-xs sm:text-sm lg:text-base font-sans font-medium  relative z-10 tracking-tight md:mb-10  ">
        <a href="mailto:info@joyzen.in" className="hover:opacity-60 transition-opacity">Email: info@joyzen.in</a>
        <a href="tel:+911244962743" className="hover:opacity-60 transition-opacity">Phone: <span className="whitespace-nowrap">+91 124-4962743</span></a>
        <a href="https://www.instagram.com/joyzen.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Instagram: @joyzen.in</a>
      </div>
      <div className="absolute  top-0 z-40 left-0 w-full h-[30%] bg-gradient-to-b from-white via-white/30 to-transparent pointer-events-none" />
      {/* Bottom fade for mobile video */}
      <div className="absolute bottom-0 z-40 left-0 w-full h-[25%] bg-gradient-to-t from-[#A9BFCF] via-[#A9BFCF]/30 to-transparent pointer-events-none sm:hidden" />
      {/* Side fades for mobile video */}
      <div className="absolute inset-y-0 left-0 z-40 w-[15%] bg-gradient-to-r from-[#EBF3F8] via-[#EBF3F8]/40 to-transparent pointer-events-none sm:hidden" />
      <div className="absolute inset-y-0 right-0 z-40 w-[15%] bg-gradient-to-l from-[#A9BFCF] via-[#A9BFCF]/40 to-transparent pointer-events-none sm:hidden" />
      {/* Logo center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none  z-0">
        <div className="relative w-full h-full will-change-transform">
          {/* Mobile footer video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover sm:hidden scale-100"
          >
            <source src="/joyzenfooterMobile.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Desktop footer video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover hidden sm:block"
          >
            <source src="/joyzen_glass_footer.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className='flex px-[10%] md:px-[5%] text-xs md:text-sm text-black flex-col absolute bottom-[8%] md:bottom-[5%] z-40 left-0 w-full sm:flex-row justify-center items-center md:justify-between'>
        <span className="text-center sm:text-left">2026 Joyzen. Built for life. Designed for longevity.</span>
        <Link href="https://www.theinternetcompany.one/" target="_blank" rel="noopener noreferrer">
          <span className="text-center md:text-right">Designed and Developed by TIC Global Services</span>
        </Link>
      </div>
    </footer>
  )
}

export default Footer;
