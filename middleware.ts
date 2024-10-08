import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const { userId, redirectToSignIn } = auth();
  const isProtectedRoute = createRouteMatcher(["/"]);

  if (userId && isProtectedRoute(req)) {
    return NextResponse.next();
  }

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: "/" });
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};