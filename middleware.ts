import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_SECRET } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (session !== SESSION_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
