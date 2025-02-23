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
  response.headers.set(
    'Content-Security-Policy',
    [
      // Allow resources from same origin by default
      "default-src 'self'",
      
      // Scripts - allow Clerk domains and necessary third-party scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://clerk.oratoria.me https://accounts.oratoria.me https://challenges.cloudflare.com",
      
      // Connections - allow Clerk domains, Supabase, and other necessary services
      "connect-src 'self' https://*.clerk.com https://clerk.oratoria.me https://accounts.oratoria.me wss://*.clerk.com https://*.supabase.co https://o449981.ingest.us.sentry.io",
      
      // Images - allow Clerk images and data URIs
      "img-src 'self' data: https://img.clerk.com https://*.clerk.com https://clerk.oratoria.me https://accounts.oratoria.me",
      
      // Styles - allow inline styles needed by Clerk
      "style-src 'self' 'unsafe-inline' https://*.clerk.com https://clerk.oratoria.me https://accounts.oratoria.me",
      
      // Frames - allow Clerk domains and Cloudflare challenges
      "frame-src 'self' https://*.clerk.com https://clerk.oratoria.me https://accounts.oratoria.me https://challenges.cloudflare.com",
      
      // Workers and other resources
      "worker-src 'self' blob:",
      "font-src 'self' data:",
      "media-src 'self'",
      "manifest-src 'self'",
      
      // Form submissions
      "form-action 'self' https://*.clerk.com https://clerk.oratoria.me https://accounts.oratoria.me"
    ].join('; ')
  );

  // Set CORS headers - allow all Clerk and app domains
  const allowedOrigins = [
    'https://oratoria.me',
    'https://accounts.oratoria.me',
    'https://clerk.oratoria.me',
    'https://img.clerk.com'
  ];
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const preflightResponse = new NextResponse(null, { status: 204 });
    if (origin && allowedOrigins.includes(origin)) {
      preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
      preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Clerk-CSRF-Token');
      preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
      preflightResponse.headers.set('Access-Control-Max-Age', '86400');
      preflightResponse.headers.set('Vary', 'Origin');
    }
    return preflightResponse;
  }

  // Set CORS headers for non-preflight requests
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }

  // If the user isn't signed in and the route is private, redirect to Account Portal
  if (!userId && !isPublicRoute(request)) {
    const redirectUrl = new URL('/sign-in', 'https://accounts.oratoria.me');
    redirectUrl.searchParams.set('redirect_url', request.url);
    // Add no-cors mode to the redirect
    return NextResponse.redirect(redirectUrl.toString(), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      }
    });
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