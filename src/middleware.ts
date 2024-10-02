import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthenticatedRoute = [
    "/dashboard",
    "/api/auth/providers",
    "/auth/sign-out",
  ].includes(pathname);

  const isPublicRoute = ["/", "/api/auth/csrf", "/api/auth/session"].includes(
    pathname
  );

  // Redirect UNauthenticated users trying to access dashboard
  if (isAuthenticatedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Redirect authenticated users trying to access non-dashboard, non-public routes
  if (!isPublicRoute && !isAuthenticatedRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
