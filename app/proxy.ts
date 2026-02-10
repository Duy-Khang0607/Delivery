import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth'


// Request -> Middleware -> Server
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const publicRoutes = ['/login', '/register', '/api/auth', '/favicon.ico', '/_next']
    if (publicRoutes?.some(route => pathname.startsWith(route))) {
        return NextResponse.next()
    }

    const session = await auth();
    if (!session) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // Kiểm tra nếu role không phải là User
    if (session?.user?.role !== 'user' && pathname.startsWith('/user')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Kiểm tra nếu role không phải là Admin
    if (session?.user?.role !== 'admin' && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Kiểm tra nếu role không phải là Delivery
    if (session?.user?.role !== 'deliveryBoy' && pathname.startsWith('/delivery')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
}


export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
}