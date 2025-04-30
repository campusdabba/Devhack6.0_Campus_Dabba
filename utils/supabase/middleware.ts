import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


const publicRoutes = ['/', '/auth/login', '/auth/register', '/browse','/cook/register','/student/register','/search',"/cart",'/checkout','cook/login','/states','/cooks/:id','/chatbot', '/auth/admin-register']


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

  // Check if the current path matches a dynamic cook route
const url = request.nextUrl.pathname
const isDynamicCookRoute = url.startsWith('/cooks/') && url.split('/').length === 3
const isPublicRoute = publicRoutes.some(route => {
  if (route === '/cooks/:id') {
    return isDynamicCookRoute
  }
  return route === url
})

  // Check if the route is an admin route
  const isAdminRoute = url.startsWith('/admin')

  if (!session && !isPublicRoute) {
    // Redirect to login if accessing protected route without session
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If it's an admin route, check if the user is an admin
  if (isAdminRoute && session) {
    const { data: isAdmin, error } = await supabase
      .rpc('is_admin', { user_id: session.user.id })

    if (error || !isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}