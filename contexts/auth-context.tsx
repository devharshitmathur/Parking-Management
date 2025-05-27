"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "../lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem("parking_admin_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch {
        localStorage.removeItem("parking_admin_user")
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { auth } = await import("../lib/auth")
    const result = await auth.login(email, password)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
      localStorage.setItem("parking_admin_user", JSON.stringify(result.user))
      return { success: true }
    }

    return { success: false, error: result.error }
  }

  const logout = async () => {
    const { auth } = await import("../lib/auth")
    await auth.logout()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    localStorage.removeItem("parking_admin_user")
  }

  const updateUser = (user: User) => {
    setAuthState((prev) => ({ ...prev, user }))
    localStorage.setItem("parking_admin_user", JSON.stringify(user))
  }

  return <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
