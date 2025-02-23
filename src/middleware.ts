import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

// OH GOD WHAT THE FUCK IS WRONG WITH THIS
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
} 