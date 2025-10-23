'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal-900 text-tuscan-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <p className="text-lg font-serif">Sip.AI</p>
          <p className="text-sm text-tuscan-300">
            &copy; {currentYear} Sip.AI. Your personal wine country concierge.
          </p>
        </div>
      </div>
    </footer>
  )
}
