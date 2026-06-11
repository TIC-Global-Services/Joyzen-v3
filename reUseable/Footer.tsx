import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative w-full h-[50svh] sm:h-[60svh] lg:h-[90svh] bg-gradient-to-r from-[#EBF3F8] via-[#D1E0EC] to-[#A9BFCF] flex flex-col justify-between p-8 sm:p-10 lg:p-[4rem] overflow-hidden">
      {/* Background Video (Defined first so overlays render on top) */}
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

      {/* Top row (Shifted slightly to the right on mobile using pl-6) */}
      <div className="flex justify-center pl-6 sm:pl-0 sm:justify-end gap-6 sm:gap-12 text-xs sm:text-sm lg:text-base font-sans font-medium  relative z-10 tracking-tight md:mb-10  ">
        <a href="mailto:info@joyzen.in" className="hover:opacity-60 transition-opacity">Email: info@joyzen.in</a>
        <a href="tel:+911244962743" className="hover:opacity-60 transition-opacity">Phone: <span className="whitespace-nowrap">+91 124-4962743</span></a>
        <a href="https://www.instagram.com/joyzen.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Instagram: @joyzen.in</a>
      </div>

      {/* Top fade (Fixed: top-[-2px] overlap and native CSS rgba() gradient to ensure full compatibility) */}
      <div 
        className="absolute z-40 left-0 w-full h-[35%] pointer-events-none" 
        style={{
          top: '-2px',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0) 100%)'
        }}
      />

      {/* Bottom fade for mobile video (Fixed: native CSS rgba() gradient to ensure full compatibility) */}
      <div 
        className="absolute bottom-0 z-40 left-0 w-full h-[25%] pointer-events-none sm:hidden" 
        style={{
          background: 'linear-gradient(to top, rgba(169, 191, 207, 1) 0%, rgba(169, 191, 207, 0.3) 50%, rgba(169, 191, 207, 0) 100%)'
        }}
      />

      {/* Side fades for mobile video (Fixed: native CSS rgba() gradient to ensure full compatibility) */}
      <div 
        className="absolute inset-y-0 left-0 z-40 w-[15%] pointer-events-none sm:hidden" 
        style={{
          background: 'linear-gradient(to right, rgba(235, 243, 248, 1) 0%, rgba(235, 243, 248, 0.4) 50%, rgba(235, 243, 248, 0) 100%)'
        }}
      />
      <div 
        className="absolute inset-y-0 right-0 z-40 w-[15%] pointer-events-none sm:hidden" 
        style={{
          background: 'linear-gradient(to left, rgba(169, 191, 207, 1) 0%, rgba(169, 191, 207, 0.4) 50%, rgba(169, 191, 207, 0) 100%)'
        }}
      />

      <div className='flex px-[10%] md:px-[5%] text-xs md:text-sm text-black flex-col absolute bottom-[8%] md:bottom-[5%] z-40 left-0 w-full sm:flex-row justify-center items-center md:justify-between'>
        <span className="text-center sm:text-left">2026 Joyzen. Built for life. Designed for longevity.</span>
        <Link href="https://www.theinternetcompany.one/" target="_blank" rel="noopener noreferrer">
          <span className="text-center md:text-right">Designed and Developed by TIC Global Services</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
