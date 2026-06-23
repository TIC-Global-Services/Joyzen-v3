'use client'
import Image from 'next/image'
import Link from 'next/link'

const NavBar = () => {
    return (
        <div className='absolute md:top-10 top-6 left-0 right-0 z-50 px-6 md:px-12 xl:px-16'>
            <div className="max-w-[1440px] mx-auto w-full">
                <nav className="w-full flex items-center justify-center">
                    <Link href="/" className="flex items-center justify-center">
                        <Image src="/orange_logo.svg" alt="Logo" width={147} height={44} className='w-25 h-10 lg:w-34 lg:h-10' />
                    </Link>
                </nav>
            </div>
        </div>
    )
}

export default NavBar
