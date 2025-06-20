"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: string | null
  isCook: boolean
  isAdmin: boolean
  isStudent: boolean
  isCustomer: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const getUserRole = async (userId: string): Promise<string> => {
    try {
      // Check users table first
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (userData?.role) {
        return Array.isArray(userData.role) ? userData.role[0] : userData.role
      }

      // Check cooks table
      const { data: cookData } = await supabase
        .from('cooks')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (cookData) {
        return 'cook'
      }

      return 'customer'
    } catch (error) {
      console.error('Error fetching user role:', error)
      return 'customer'
    }
  }

  const refreshUser = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      setSession(currentSession)
      setUser(currentSession?.user || null)
      
      if (currentSession?.user) {
        const role = await getUserRole(currentSession.user.id)
        setUserRole(role)
      } else {
        setUserRole(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setSession(null)
      setUser(null)
      setUserRole(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setUserRole(null)
  }

  useEffect(() => {
    refreshUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
        setUserRole(null)
        setLoading(false)
      } else if (currentSession?.user) {
        setSession(currentSession)
        setUser(currentSession.user)
        
        const role = await getUserRole(currentSession.user.id)
        setUserRole(role)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Helper functions to check roles
  const isCook = userRole === 'cook'
  const isAdmin = userRole === 'admin'
  const isStudent = userRole === 'student'
  const isCustomer = userRole === 'customer'

  const value: AuthContextType = {
    user,
    session,
    userRole,
    isCook,
    isAdmin,
    isStudent,
    isCustomer,
    loading,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
