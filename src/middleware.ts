import { NextResponse } from "next/server";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isRoot = createRouteMatcher(["/"]);
const isPublicPage = createRouteMatcher(["/signin", "/resetPassword"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/(.*)",
]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  const isLoggedIn = await convexAuth.isAuthenticated();

  if (isRoot(req)) {
    return nextjsMiddlewareRedirect(req, "/signin");
  }

  if (isProtectedRoute(req) && !isPublicPage(req) && !isLoggedIn) {
    return nextjsMiddlewareRedirect(req, "/signin");
  }

  if (isAdminRoute(req) && isLoggedIn) {
    const token = await convexAuth.getToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          path: "queries/users:me",
          args: {},
          format: "json",
        }),
      }
    );

    const data = await response.json();
    const user = data.value;

    if (user?.role !== "admin") {
      return nextjsMiddlewareRedirect(req, "/dashboard");
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
