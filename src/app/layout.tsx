import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { AdBanner } from '@/components/AdBanner'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Sip.AI - Your Personal Wine Country Concierge',
  description: 'Discover the finest wineries, restaurants, and experiences in Sonoma, Napa, and Mendocino with your AI-powered wine country guide.',
  keywords: 'wine country, napa valley, sonoma, mendocino, wineries, restaurants, hotels, travel guide, ai wine concierge',
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

            <footer className="bg-charcoal-900 text-tuscan-100 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-2">
                  <p className="text-lg font-serif">Sip.AI</p>
                  <p className="text-sm text-tuscan-300">&copy; 2024 Sip.AI. Your personal wine country concierge.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}