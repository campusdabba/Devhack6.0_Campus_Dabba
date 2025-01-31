import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

<<<<<<< HEAD
<<<<<<< HEAD
const publicRoutes = ['/', '/auth/login', '/auth/register', '/browse','/cook/register','/student/register','/search',"/cart",'/checkout','cook/login','/states']
=======
const publicRoutes = ['/', '/auth/login', '/auth/register', '/browse','/cook/register','/student/register','/search']
>>>>>>> 3be442bcdc62f9e590e91fd40a9f56038d458aa0
=======
const publicRoutes = ['/', '/auth/login', '/auth/register', '/browse','/cook/register','/student/register','/search']
>>>>>>> origin/main


export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Check if the route requires authentication
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (!session && !isPublicRoute) {
    // Redirect to login if accessing protected route without session
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}