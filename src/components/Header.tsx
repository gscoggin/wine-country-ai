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
      <header className="bg-white/80 backdrop-blur-sm border-b border-wine-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-wine-600 to-vineyard-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍷</span>
              </div>
              <h1 className="text-xl font-bold text-wine-800">Wine Country AI</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-wine-600 transition-colors">
                Home
              </a>
              <a href="/directory" className="text-gray-700 hover:text-wine-600 transition-colors">
                Directory
              </a>
              <a href="/trips" className="text-gray-700 hover:text-wine-600 transition-colors">
                My Trips
              </a>
              <a href="/about" className="text-gray-700 hover:text-wine-600 transition-colors">
                About
              </a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-wine-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-wine-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-wine-600" />
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
                className="md:hidden text-gray-700 hover:text-wine-600 transition-colors"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-wine-100 py-4">
              <nav className="flex flex-col space-y-4">
                <a
                  href="/"
                  className="text-gray-700 hover:text-wine-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </a>
                <a
                  href="/directory"
                  className="text-gray-700 hover:text-wine-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Directory
                </a>
                <a
                  href="/trips"
                  className="text-gray-700 hover:text-wine-600 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Trips
                </a>
                <a
                  href="/about"
                  className="text-gray-700 hover:text-wine-600 transition-colors"
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
