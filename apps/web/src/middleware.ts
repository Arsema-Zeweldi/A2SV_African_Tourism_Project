import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/", "/landing"]
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"]

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value
  const { pathname } = request.nextUrl

  // Auth pages: if already logged in → redirect to /home
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/home", request.url))
    }
    return NextResponse.next()
  }

  // Public routes: allow anyone
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Everything else is protected: no token → redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all routes except static files, images, and Next.js internals
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|images|plan_trip|homepage|.*\\..*).*)",
  ],
}
