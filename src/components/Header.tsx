'use client'

import { useState } from 'react'
import { User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { LoginModal } from './LoginModal'

export function Header() {
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-tuscan-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">🍷</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-charcoal-900">Sip<span className="text-terracotta-600">.AI</span></h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-10">
              <a href="/" className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium">
                Home
              </a>
              <a href="/directory" className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium">
                Directory
              </a>
              <a href="/trips" className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium">
                My Trips
              </a>
              <a href="/about" className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium">
                About
              </a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-charcoal-700 hover:text-terracotta-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-terracotta-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-terracotta-600" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <a
                        href="/trips"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Trips
                      </a>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="btn-primary text-sm"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-charcoal-700 hover:text-terracotta-600 transition-colors"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-tuscan-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a
                  href="/"
                  className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </a>
                <a
                  href="/directory"
                  className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Directory
                </a>
                <a
                  href="/trips"
                  className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Trips
                </a>
                <a
                  href="/about"
                  className="text-charcoal-700 hover:text-terracotta-600 transition-colors font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </a>
                {!user && (
                  <button
                    onClick={() => {
                      setShowLoginModal(true)
                      setShowMobileMenu(false)
                    }}
                    className="btn-primary text-sm w-full"
                  >
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}
