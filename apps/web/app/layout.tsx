import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import type { Metadata } from "next"
import localFont from "next/font/local"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "eNabha - Telemedicine Service | Government of India",
  description:
    "Official telemedicine platform by Ministry of Health & Family Welfare, Government of India. Connecting rural communities with quality healthcare.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        {/* Preload fonts for better performance */}
        <link 
          rel="preload" 
          href="https://fonts.gstatic.com/s/notosansdevanagari/v25/TuGoUUFzXI5FBtUq5a8bjKYTZjtRU6Sgv3NaV_SNmI0b8QQCQmHn6B2OHjbL_08AlXQly_AHgU4.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="https://fonts.gstatic.com/s/notosansgurmukhi/v26/dDFnGS0VYaJUj3ZLwq7RDyH5DowHy5hUkqOmOw.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LanguageProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
