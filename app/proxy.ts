import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


// Request -> Middleware -> Server
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const publicRoutes = ['/login', '/register', '/api/auth', '/favicon.ico', '/_next']
    if (publicRoutes?.some(route => pathname.startsWith(route))) {
        return NextResponse.next()
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(loginUrl)
    }
    
    return NextResponse.next()
}


export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
}