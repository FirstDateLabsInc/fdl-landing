import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/sections/Footer"
import { poppins } from "./fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: "Juliet: Your AI Dating Coach for Real Connections",
  description:
    "Meet Juliet: an AI dating coach that helps you practice real first-date conversations, get instant feedback, and prepare for your next date—so you can build meaningful connections.",
  metadataBase: new URL("https://firstdatelabs.com"),
  openGraph: {
    title: "Juliet: Your AI Dating Coach for Real Connections",
    description:
      "Meet Juliet: an AI dating coach that helps you practice real first-date conversations, get instant feedback, and prepare for your next date—so you can build meaningful connections.",
    url: "https://firstdatelabs.com",
    siteName: "First Date Labs",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased bg-[#fffdf6] text-slate-900">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
