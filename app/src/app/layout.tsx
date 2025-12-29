import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Suspense } from "react"
import Script from "next/script"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/sections/Footer"
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider"
import { poppins } from "./fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: "Juliet: Your AI Dating Coach for Real Connections",
  description:
    "Meet Juliet: an AI dating coach that helps you practice real first-date conversations, get instant feedback, and prepare for your next date—so you can build meaningful connections.",
  metadataBase: new URL("https://firstdatelabs.com"),
  alternates: {
    canonical: "https://firstdatelabs.com",
  },
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
      {/* Region-based Consent Mode - MUST run before gtag config */}
      <Script id="google-consent" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          // Region-specific defaults: denied for EEA/UK, granted elsewhere
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR',
                       'DE','GR','HU','IE','IT','LV','LT','LU','MT','NL',
                       'PL','PT','RO','SK','SI','ES','SE','GB','IS','LI','NO']
          });

          // Default for all other regions (US, etc.) - full tracking
          gtag('consent', 'default', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted'
          });
        `}
      </Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
            send_page_view: false
          });
        `}
      </Script>
      <body className="antialiased bg-[#fffdf6] text-slate-900">
        <Suspense fallback={null}>
          <AnalyticsProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  )
}
