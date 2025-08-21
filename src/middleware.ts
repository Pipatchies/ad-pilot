import { NextResponse } from "next/server";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isRoot = createRouteMatcher(["/"]);
const isSignIn = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",

]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  const isLoggedIn = await convexAuth.isAuthenticated();

  if (isRoot(req)) {
    return nextjsMiddlewareRedirect(req, "/signin");
  }

  if (isProtectedRoute(req) && !isLoggedIn) {
    return nextjsMiddlewareRedirect(req, "/signin");
  }

  if (isSignIn(req) && isLoggedIn) {
    return nextjsMiddlewareRedirect(req, "/dashboard");
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};

