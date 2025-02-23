import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that don't require authentication
const isPublicRoute = createRouteMatcher(['/', '/sign-in', '/sign-up']);

// Define routes that are allowed even without completing onboarding
const isAllowedWithoutOnboarding = createRouteMatcher([
  '/onboarding',
  '/dashboard',
  '/settings',
  '/courses(.*)',  // Allow all course-related routes
  '/quick-training(.*)', // Allow quick training
  '/custom(.*)', // Allow custom situations
  '/api(.*)'  // Allow API routes
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = request.nextUrl;

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  if (userId && ['/sign-in', '/sign-up'].includes(pathname)) {
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

  return NextResponse.next();
});

// Protect all routes except public ones and static files
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.[\\w]+$|_next).*)',
    '/(api|trpc)(.*)',
  ],
};