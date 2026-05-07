import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
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

  // Do not run on static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return supabaseResponse
  }

  // IMPORTANT: You *must* return the supabaseResponse object as is. If you're creating a
  // new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but keep the cookies!
  // 4. Return myNewResponse
  // The above is true for both successful and error responses.

  let user = null
  try {
    // 3-second timeout to prevent Vercel 504 Gateway Timeout (MIDDLEWARE_INVOCATION_TIMEOUT)
    const getUserPromise = supabase.auth.getUser()
    const timeoutPromise = new Promise<{ data: { user: any }, error: any }>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase Auth Timeout')), 3000)
    )

    const response = await Promise.race([getUserPromise, timeoutPromise])
    user = response.data.user
  } catch (error) {
    console.error("Middleware getUser timeout/error, falling back to getSession:", error)
    // Fallback to getSession which relies on the local cookie (faster, no network request)
    const { data: { session } } = await supabase.auth.getSession()
    user = session?.user || null
  }

  const isEnterPage = request.nextUrl.pathname.startsWith('/enter')

  // Redirection Logic
  if (!user && !isEnterPage) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/enter'
    return NextResponse.redirect(url)
  }

  if (user && isEnterPage) {
    // user is logged in, redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
