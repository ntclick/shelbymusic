import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'PhoneZoo AI Ringtones — Create Unique Ringtones with AI',
    template: '%s | PhoneZoo AI Ringtones',
  },
  description: 'Generate custom AI ringtones in seconds. Choose a genre, describe your sound, and download a unique MP3 ringtone powered by ACE-Step AI.',
  keywords: ['AI ringtone generator', 'custom ringtones', 'AI music', 'free ringtone maker'],
  openGraph: {
    type: 'website',
    siteName: 'PhoneZoo AI Ringtones',
    title: 'PhoneZoo — Create AI Ringtones in Seconds',
    description: 'Generate unique AI ringtones for free. Powered by ACE-Step AI.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://phonezoo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhoneZoo AI Ringtones',
    description: 'Generate unique AI ringtones for free.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://phonezoo.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-bg-main text-brand-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
