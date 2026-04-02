import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, decode JWT payload and check role + expiry
  if (pathname.startsWith('/admin')) {
    try {
      const b64 = token.split('.')[1];
      const payload = JSON.parse(atob(b64.replace(/-/g, '+').replace(/_/g, '/')));

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }

      if (payload.role !== 'admin' && payload.role !== 'moderator') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
