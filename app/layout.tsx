import type { Metadata } from "next";
import { satoshi, noria } from "@/fonts";
import "./globals.css";
import SmoothScroll from "@/reUseable/SmoothScroll";
import Navbar from "@/reUseable/NavBar";
import Footer from "@/reUseable/Footer";
import Preloader from "@/reUseable/Preloader";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata:Metadata = {
  title: "Joyzen | Health Tech Innovation for Human Longevity",

  description:
    "Joyzen brings innovation to health tech, advancing human longevity through continuous, connected healthcare with the same doctor guiding your journey online and in clinic.",

  keywords: [
    "Health tech innovation",
    "Human longevity",
    "Longevity healthcare",
    "Continuous healthcare system",
    "Connected healthcare",
    "Personalized long-term care",
    "Joyzen health tech",
    "Future of healthcare"
  ],

  openGraph: {
    title: "Joyzen – Health Tech Innovation for Human Longevity",
    description:
      "A new way of healthcare driven by health tech innovation, with one doctor guiding your journey toward human longevity, continuously, online and in clinic.",
    url: "https://doctors.joyzen.in",
    siteName: "Joyzen",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${noria.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScroll>
          <Preloader/>
          <Navbar/>
          {children}
          <Footer/>
        </SmoothScroll>
      </body>
    </html>
  );
}
