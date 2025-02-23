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
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', 'https://accounts.oratoria.me');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Clerk-CSRF-Token, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '7200');
    return response;
  }

  const { userId, sessionClaims } = await auth();
  const { pathname } = request.nextUrl;

  // Handle RSC (React Server Component) requests differently
  const isRSC = request.headers.get('RSC') === '1' || new URL(request.url).searchParams.has('_rsc');
  if (isRSC && !userId) {
    const response = new NextResponse(null, { status: 401 });
    addCorsHeaders(response);
    return response;
  }

  // Handle authentication redirects
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL('/sign-in', 'https://accounts.oratoria.me');
    signInUrl.searchParams.set('redirect_url', request.url);
    
    const response = NextResponse.redirect(signInUrl);
    addCorsHeaders(response);
    return response;
  }

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  if (userId && pathname === '/') {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    addCorsHeaders(response);
    return response;
  }

  // Check if user needs to complete onboarding
  const metadata = sessionClaims?.metadata as { onboardingComplete?: boolean } | undefined;
  if (
    userId && 
    !metadata?.onboardingComplete && 
    !isAllowedWithoutOnboarding(request) && 
    !isPublicRoute(request)
  ) {
    const response = NextResponse.redirect(new URL('/onboarding', request.url));
    addCorsHeaders(response);
    return response;
  }

  const response = NextResponse.next();
  addCorsHeaders(response);
  return response;
});

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', 'https://accounts.oratoria.me');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Clerk-CSRF-Token, Authorization');
}

// Protect all routes except public ones and static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};