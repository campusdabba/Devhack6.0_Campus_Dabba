"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  requireCook?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireCook = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isAdmin, isCook, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push(redirectTo)
      return
    }

    // Check if admin access is required
    if (requireAdmin && !isAdmin) {
      router.push('/unauthorized')
      return
    }

    // Check if cook access is required
    if (requireCook && !isCook) {
      router.push('/unauthorized')
      return
    }
  }, [user, isAdmin, isCook, loading, router, requireAuth, requireAdmin, requireCook, redirectTo])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (
    (requireAuth && !user) ||
    (requireAdmin && !isAdmin) ||
    (requireCook && !isCook)
  ) {
    return null
  }

  return <>{children}</>
}
