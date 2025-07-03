// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Debug token

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      const isAdmin = token?.role === 'ADMIN' || token?.email === 'animalfam.help@gmail.com';
      if (!isAdmin) {
        return NextResponse.redirect(
          new URL('/auth/signin?callbackUrl=' + encodeURIComponent(req.nextUrl.pathname), req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {

        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN' || token?.email === 'animalfam.help@gmail.com';
        }

        // Protect user-specific routes
        if (
          req.nextUrl.pathname.startsWith('/profile') ||
          req.nextUrl.pathname.startsWith('/orders') ||
          req.nextUrl.pathname.startsWith('/settings')
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/orders/:path*', '/settings/:path*'],
};