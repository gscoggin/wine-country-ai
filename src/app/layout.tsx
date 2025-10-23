import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { AdBanner } from '@/components/AdBanner'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Wine Country AI - Your Personal Wine Country Guide',
  description: 'Discover the best wineries, restaurants, hotels, and experiences in Sonoma, Napa, and Mendocino with AI-powered recommendations.',
  keywords: 'wine country, napa valley, sonoma, mendocino, wineries, restaurants, hotels, travel guide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-wine-50 to-vineyard-50">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="bg-wine-800 text-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <p>&copy; 2024 Wine Country AI. Your personal guide to Northern California wine country.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}