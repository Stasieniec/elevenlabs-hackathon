import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/_next(.*)',
  '/favicon.ico',
  '/api/trpc(.*)',
  '/api/(.*)' 
]);

// Protect all routes except public ones and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export default clerkMiddleware((auth, request) => {
  // Early return for OPTIONS requests
  if (request.method === 'OPTIONS') {
    return NextResponse.next();
  }

  // Early return for public static files
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  return auth().then(({ userId }) => {
    const { pathname } = request.nextUrl;
    const isRSC = request.headers.get('RSC') || request.url.includes('_rsc=');

    console.log('[middleware] userId:', userId, 'pathname:', pathname, 'isPublic:', isPublicRoute(request));

    // For RSC requests without authentication, return 401
    if (isRSC && !userId && !isPublicRoute(request)) {
      return new NextResponse(null, { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // For non-RSC requests without authentication on protected routes
    if (!userId && !isPublicRoute(request)) {
      const signInUrl = new URL('/sign-in', 'https://accounts.oratoria.me');
      signInUrl.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  });
});