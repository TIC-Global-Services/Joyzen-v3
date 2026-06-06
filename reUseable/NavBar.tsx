'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const formattedDate = new Date().toISOString().split('T')[0]

const navLink = [
    {
        title: "What You Get",
        href: "#what-you-get"
    },
    {
        title: "Our Care",
        href: "#care"
    }
]

const NavBar = () => {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pillRef = useRef<HTMLDivElement>(null)
    const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([])

    const isHome = pathname === '/' || pathname === '/contact/'
    const activeTextColor = isHome ? 'text-black' : 'text-white'
    const inactiveTextColor = isHome ? 'text-black' : 'text-white [text-shadow:_0_1px_6px_rgba(0,0,0,0.35)]'
    const hoverBg = isHome ? 'hover:bg-black/5' : 'hover:bg-white/10'

    const activeIndex = navLink.findIndex(
        (link) => pathname === link.href || pathname.startsWith(link.href + '/')
    )

    // Animate the pill position to match the active nav link
    const updatePill = useCallback(() => {
        const activeLink = navLinksRef.current[activeIndex];
        const pill = pillRef.current;
        if (!activeLink || !pill || activeIndex < 0) return;

        const linkRect = activeLink.getBoundingClientRect();
        const parentRect = activeLink.parentElement?.getBoundingClientRect();
        if (!parentRect) return;

        const left = linkRect.left - parentRect.left;
        const width = linkRect.width;

        pill.style.transform = `translateX(${left}px)`;
        pill.style.width = `${width}px`;
    }, [activeIndex]);

    useEffect(() => {
        updatePill();
        window.addEventListener("resize", updatePill);
        return () => window.removeEventListener("resize", updatePill);
    }, [updatePill]);

    return (
        <div className='absolute md:top-10 top-6 left-0 right-0 z-50 px-6 md:px-12 xl:px-16'>
            <div className="max-w-[1440px] mx-auto w-full">
                <nav className="flex items-center justify-between">
                    <Link href="/">
                        <Image src="/orange_logo.svg" alt="Logo" width={147} height={44} className='w-25 h-10 lg:w-34 lg:h-10' />
                    </Link>



                <div className="flex items-center gap-2">
                    <Link href={`https://calendly.com/joyzen-system/15min?date=${formattedDate}`} target='_blank'>
                        <button className={`hidden px-3 lg:px-6 md:flex gap-2 text-xs lg:text-base items-center justify-center py-1.5 lg:py-2.5 rounded-[2.625rem] border border-white/10 backdrop-blur-xs shadow-md font-satoshi font-medium hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group ${isHome ? 'bg-white/10 hover:bg-[#F9F9F9]' : 'bg-white/20 hover:bg-white/30'}`}>
                            <span className={inactiveTextColor}>Consultation Now</span>
                            <span className="ml-1 font-mono text-lg leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                    </Link>

                    {/* Mobile Hamburger Menu (Removed) */}
                </div>
            </nav>
        </div>

            {/* Mobile Menu Dropdown (Removed) */}
        </div>
    )
}

export default NavBar
