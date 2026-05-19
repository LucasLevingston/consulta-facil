import { type NextRequest, NextResponse } from "next/server";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "../routes";

function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;

  const pathname = nextUrl.pathname;

  const token = cookies.get("token")?.value;

  const isLoggedIn = !!token;

  const isPublicRoute = publicRoutes.includes(pathname);

  const isAuthRoute = pathname.startsWith(authRoutes);

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
