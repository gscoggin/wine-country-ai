import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { AdBanner } from '@/components/AdBanner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: {
    default: 'Sip.AI - Your Personal Wine Country Concierge',
    template: '%s | Sip.AI'
  },
  description: 'Discover the finest wineries, restaurants, and experiences in Sonoma, Napa, and Mendocino with your AI-powered wine country guide. Plan your perfect wine country adventure.',
  keywords: ['wine country', 'napa valley', 'sonoma county', 'mendocino', 'wineries', 'wine tasting', 'restaurants', 'hotels', 'travel guide', 'ai wine concierge', 'wine tours', 'california wine'],
  authors: [{ name: 'Sip.AI' }],
  creator: 'Sip.AI',
  publisher: 'Sip.AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://sip-ai.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Sip.AI - Your Personal Wine Country Concierge',
    description: 'Discover the finest wineries, restaurants, and experiences in Sonoma, Napa, and Mendocino with your AI-powered wine country guide.',
    siteName: 'Sip.AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sip.AI - Wine Country Concierge',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sip.AI - Your Personal Wine Country Concierge',
    description: 'Discover the finest wineries, restaurants, and experiences in Northern California wine country.',
    images: ['/og-image.jpg'],
    creator: '@sipai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-tuscan-50 via-white to-terracotta-50">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}