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
  
  // Set CSP headers to allow necessary domains (all in one line to avoid formatting issues)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self' https://*.clerk.com https://*.oratoria.me https://*.sentry-cdn.com https://*.sentry.io; connect-src 'self' https://*.clerk.com https://*.oratoria.me https://*.sentry-cdn.com https://*.sentry.io https://o449981.ingest.us.sentry.io wss://*.clerk.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://*.clerk.com https://*.sentry-cdn.com https://clerk.oratoria.me https://*.oratoria.me; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://*.clerk.com https://clerk.oratoria.me https://*.oratoria.me; img-src 'self' data: blob: https://*.clerk.com https://*.oratoria.me; frame-src 'self' https://*.clerk.com https://*.oratoria.me; media-src 'self' https://*.clerk.com https://*.oratoria.me"
  );

  // Set CORS headers - allow both main domain and accounts subdomain
  const allowedOrigins = ['https://oratoria.me', 'https://accounts.oratoria.me'];
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response;
  }

  // If the user isn't signed in and the route is private, redirect to Account Portal
  if (!userId && !isPublicRoute(request)) {
    return NextResponse.redirect(`https://accounts.oratoria.me/sign-in?redirect_url=${encodeURIComponent(request.url)}`);
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