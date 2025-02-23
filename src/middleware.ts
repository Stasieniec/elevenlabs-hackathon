import { clerkMiddleware } from "@clerk/nextjs/server";

// Disable debug mode to avoid header encoding issues
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!_next/static|_next/image|_vercel|favicon.ico).*)'],
}; 