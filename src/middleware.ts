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

  // Handle RSC (React Server Component) requests differently
  const isRSC = request.headers.get('RSC') === '1' || new URL(request.url).searchParams.has('_rsc');
  if (isRSC && !userId) {
    // For RSC requests, return a 401 instead of redirecting
    return new NextResponse(null, { status: 401 });
  }

  // Handle authentication redirects
  if (!userId && !isPublicRoute(request)) {
    // For regular requests, redirect to sign in
    const signInUrl = new URL('/sign-in', 'https://accounts.oratoria.me');
    signInUrl.searchParams.set('redirect_url', request.url);
    
    // Return redirect with appropriate headers
    const response = NextResponse.redirect(signInUrl);
    response.headers.set('Access-Control-Allow-Origin', 'https://oratoria.me');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
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

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', 'https://oratoria.me');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
});

// Protect all routes except public ones and static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};