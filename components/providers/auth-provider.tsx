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
  refreshCounter: number // Add this to force re-renders
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  forceRefresh: () => void // Add manual refresh function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | string[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false) // Prevent concurrent refreshes
  const [refreshCounter, setRefreshCounter] = useState(0) // Force re-renders
  const supabase = createClient()

  // Cache user role to avoid repeated DB calls
  const [roleCache, setRoleCache] = useState<Record<string, { role: string | string[], timestamp: number }>>({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const getUserRole = async (userId: string): Promise<string | string[] | null> => {
    console.log('Fetching role for user:', userId)
    
    // Check cache first
    const cached = roleCache[userId]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached role:', cached.role)
      return cached.role
    }

    try {
      console.log('Querying users table...')
      // Try to get from users table first with timeout
      const usersPromise = supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      const { data: userData, error: userError } = await Promise.race([
        usersPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Users query timeout')), 3000)
        )
      ]) as any

      console.log('Users query result:', { userData, userError })

      if (userError && userError.code !== 'PGRST116') {
        console.error('Users table error:', userError)
      }

      if (userData?.role) {
        const role = userData.role
        console.log('Found role in users table:', role)
        setRoleCache(prev => ({
          ...prev,
          [userId]: { role, timestamp: Date.now() }
        }))
        return role
      }

      console.log('Querying cooks table...')
      // If not in users table, check if they're a cook
      const cooksPromise = supabase
        .from('cooks')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      const { data: cookData, error: cookError } = await Promise.race([
        cooksPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Cooks query timeout')), 3000)
        )
      ]) as any

      console.log('Cooks query result:', { cookData, cookError })

      if (cookError && cookError.code !== 'PGRST116') {
        console.error('Cooks table error:', cookError)
      }

      if (cookData) {
        const role = 'cook'
        console.log('Found user as cook')
        setRoleCache(prev => ({
          ...prev,
          [userId]: { role, timestamp: Date.now() }
        }))
        return role
      }

      console.log('No role found for user, defaulting to customer')
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
    console.log('Starting refreshUser...')
    setLoading(true)
    try {
      console.log('Getting session...')
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      console.log('Session result:', !!currentSession)
      
      if (currentSession?.user) {
        console.log('User found, setting session and user...')
        setSession(currentSession)
        setUser(currentSession.user)
        
        console.log('Fetching user role...')
        const role = await getUserRole(currentSession.user.id)
        console.log('Role fetched:', role)
        setUserRole(role)
      } else {
        console.log('No session, clearing user data...')
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
      console.log('Finished refreshUser, setting loading to false')
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setUserRole(null)
    setRoleCache({}) // Clear cache on sign out
  }

  const forceRefresh = () => {
    console.log('Force refreshing auth state...')
    setRefreshCounter(prev => prev + 1)
    refreshUser()
  }

  useEffect(() => {
    let mounted = true;
    
    // Initial session check with timeout safety
    const initAuth = async () => {
      if (!mounted) return;
      
      try {
        await Promise.race([
          refreshUser(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth initialization timeout')), 6000)
          )
        ])
      } catch (error) {
        console.error('Auth initialization failed:', error)
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    // Listen for auth state changes and handle them properly
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event)
      
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state...')
        setUser(null)
        setSession(null)
        setUserRole(null)
        setRoleCache({})
        setLoading(false)
      } else if (event === 'SIGNED_IN' && currentSession?.user) {
        console.log('User signed in, refreshing auth state...')
        // Force immediate refresh
        setRefreshCounter(prev => prev + 1)
        setSession(currentSession)
        setUser(currentSession.user)
        
        // Fetch role for the new user
        try {
          const role = await getUserRole(currentSession.user.id)
          console.log('New user role fetched:', role)
          setUserRole(role)
          // Force another refresh after role is set
          setRefreshCounter(prev => prev + 1)
        } catch (error) {
          console.error('Error fetching role after sign in:', error)
          setUserRole('customer') // Default fallback
          // Force refresh even on error
          setRefreshCounter(prev => prev + 1)
        }
      } else if (event === 'TOKEN_REFRESHED' && currentSession?.user) {
        console.log('Token refreshed, updating session...')
        setSession(currentSession)
        // Don't need to refetch role on token refresh, just update session
      }
    })

    return () => {
      mounted = false;
      subscription.unsubscribe()
    }
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
    refreshCounter,
    signOut,
    refreshUser,
    forceRefresh,
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
