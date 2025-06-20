"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: string | string[] | null
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
  const [userRole, setUserRole] = useState<string | string[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClient()

  // Cache user role to avoid repeated DB calls
  const [roleCache, setRoleCache] = useState<Record<string, { role: string | string[], timestamp: number }>>({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const getUserRole = async (userId: string): Promise<string | string[] | null> => {
    // Check cache first
    const cached = roleCache[userId]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.role
    }

    try {
      // Try to get from users table first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (userData?.role) {
        const role = userData.role
        setRoleCache(prev => ({
          ...prev,
          [userId]: { role, timestamp: Date.now() }
        }))
        return role
      }

      // If not in users table, check if they're a cook
      const { data: cookData, error: cookError } = await supabase
        .from('cooks')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (cookData) {
        const role = 'cook'
        setRoleCache(prev => ({
          ...prev,
          [userId]: { role, timestamp: Date.now() }
        }))
        return role
      }

      // Default to customer if no role found
      const defaultRole = 'customer'
      setRoleCache(prev => ({
        ...prev,
        [userId]: { role: defaultRole, timestamp: Date.now() }
      }))
      return defaultRole
    } catch (error) {
      console.error('Error fetching user role:', error)
      // On error, default to customer to prevent infinite loading
      const defaultRole = 'customer'
      setRoleCache(prev => ({
        ...prev,
        [userId]: { role: defaultRole, timestamp: Date.now() }
      }))
      return defaultRole
    }
  }

  const refreshUser = async () => {
    if (isRefreshing) return // Prevent concurrent refresh calls
    
    setIsRefreshing(true)
    setLoading(true)
    
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession?.user) {
        setSession(currentSession)
        setUser(currentSession.user)
        
        const role = await getUserRole(currentSession.user.id)
        setUserRole(role)
      } else {
        setSession(null)
        setUser(null)
        setUserRole(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setSession(null)
      setUser(null)
      setUserRole(null)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setUserRole(null)
    setRoleCache({}) // Clear cache on sign out
  }

  useEffect(() => {
    // Initial session check
    refreshUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_OUT' || !currentSession) {
        setUser(null)
        setSession(null)
        setUserRole(null)
        setRoleCache({})
        setLoading(false)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (!isRefreshing) { // Only process if not already refreshing
          setLoading(true)
          setSession(currentSession)
          setUser(currentSession.user)
          
          if (currentSession.user) {
            try {
              const role = await getUserRole(currentSession.user.id)
              setUserRole(role)
            } catch (error) {
              console.error('Error fetching user role:', error)
              setUserRole('customer') // Default fallback
            }
          }
          setLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Helper functions to check roles
  const isCook = userRole === 'cook' || (Array.isArray(userRole) && userRole.includes('cook'))
  const isAdmin = userRole === 'admin' || (Array.isArray(userRole) && userRole.includes('admin'))
  const isStudent = userRole === 'student' || (Array.isArray(userRole) && userRole.includes('student'))
  const isCustomer = userRole === 'customer' || (Array.isArray(userRole) && userRole.includes('customer'))

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
