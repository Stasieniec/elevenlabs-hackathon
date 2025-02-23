import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/_next(.*)',
  '/favicon.ico',
  '/api/trpc(.*)'
]);

// Define routes that are allowed even without completing onboarding
const isAllowedWithoutOnboarding = createRouteMatcher([
  '/onboarding(.*)',
  '/dashboard(.*)',
  '/settings(.*)',
  '/courses(.*)',
  '/quick-training(.*)',
  '/custom(.*)',
  '/api(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Add CORS and security headers
  const response = NextResponse.next();
  
  // Set CSP headers according to Clerk's requirements
  // https://clerk.com/docs/security/clerk-csp
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.oratoria.me https://*.clerk.com https://challenges.cloudflare.com",
      "connect-src 'self' https://clerk.oratoria.me https://*.clerk.com wss://*.clerk.com https://o449981.ingest.us.sentry.io",
      "img-src 'self' data: https://img.clerk.com https://*.clerk.com",
      "style-src 'self' 'unsafe-inline'",
      "frame-src 'self' https://clerk.oratoria.me https://*.clerk.com https://challenges.cloudflare.com",
      "worker-src 'self' blob:",
      "form-action 'self'",
      "font-src 'self' data:",
      "manifest-src 'self'"
    ].join('; ')
  );

  // Set CORS headers - dynamically handle both domains
  const allowedOrigins = ['https://oratoria.me', 'https://accounts.oratoria.me', 'https://clerk.oratoria.me'];
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const preflightResponse = new NextResponse(null, { status: 204 });
    if (origin && allowedOrigins.includes(origin)) {
      preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
    }
    preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Clerk-CSRF-Token');
    preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    preflightResponse.headers.set('Access-Control-Max-Age', '86400');
    return preflightResponse;
  }

  // Set CORS headers for non-preflight requests
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // If the user isn't signed in and the route is private, redirect to Account Portal
  if (!userId && !isPublicRoute(request)) {
    const redirectUrl = new URL('/sign-in', 'https://accounts.oratoria.me');
    redirectUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  if (userId && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check if user needs to complete onboarding
  const metadata = sessionClaims?.metadata as { onboardingComplete?: boolean } | undefined;
  if (
    userId && 
    !metadata?.onboardingComplete && 
    !isAllowedWithoutOnboarding(request) && 
    !isPublicRoute(request)
  ) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return response;
});

// Protect all routes except public ones and static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};