import type { Metadata } from "next";
import { satoshi, epilogue } from "@/fonts";
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
  title: "Joyzen Fertility Clinic | IVF & Reproductive Care in Chennai",

  description:
    "Joyzen offers continuous fertility and reproductive healthcare in Chennai. Get personalized IVF care, hormone management, and lifestyle support with the same doctor online and in clinic.",

  keywords: [
    "Fertility clinic Chennai",
    "IVF treatment Chennai",
    "Reproductive healthcare India",
    "Fertility doctor online consultation",
    "Hormone treatment women",
    "Personalized fertility care",
    "Joyzen fertility clinic",
    "Continuous healthcare system"
  ],

  openGraph: {
    title: "Joyzen Fertility Clinic – Continuous Fertility Care",
    description:
      "A new way of reproductive healthcare with one doctor guiding your journey continuously, online and in clinic.",
    url: "https://joyzen.in",
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
      className={`${satoshi.variable} ${epilogue.variable}  h-full antialiased`}
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
