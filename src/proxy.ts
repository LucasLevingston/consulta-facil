import { type NextRequest } from "next/server";


export function proxy(request: NextRequest) {
  // const { nextUrl, cookies } = request;

  // const pathname = nextUrl.pathname;

  // const token = cookies.get("token")?.value;

  // const isLoggedIn = !!token;

  // const isPublicRoute = publicRoutes.includes(pathname);

  // const isAuthRoute = authRoutes.includes(pathname);

  // if (isAuthRoute && isLoggedIn) {
  //   return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  // }

  // if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
  //   return NextResponse.redirect(new URL("/auth/login", nextUrl));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};