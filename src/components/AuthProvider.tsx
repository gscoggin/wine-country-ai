'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  preferences: {
    wineTypes: string[]
    budget: string
    travelStyle: string
    interests: string[]
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('wine-country-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in production, this would call your auth API
      if (email && password) {
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          preferences: {
            wineTypes: ['Cabernet Sauvignon', 'Chardonnay'],
            budget: '$$$',
            travelStyle: 'Luxury',
            interests: ['Wine Tasting', 'Fine Dining', 'Spa']
          }
        }
        setUser(mockUser)
        localStorage.setItem('wine-country-user', JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Mock registration - in production, this would call your auth API
      if (email && password && name) {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          preferences: {
            wineTypes: [],
            budget: '$$',
            travelStyle: 'Casual',
            interests: []
          }
        }
        setUser(mockUser)
        localStorage.setItem('wine-country-user', JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('wine-country-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}