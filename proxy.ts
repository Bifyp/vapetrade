// proxy.ts (Next.js 16: переименован из middleware.ts)
// Запускается на Node.js runtime, перехватывает все запросы

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Роуты, требующие авторизации
const PROTECTED_ROUTES = [
  "/ads/new",
  "/profile",
  "/chat",
  "/admin",
];

// Роуты только для неавторизованных (редиректим залогиненных)
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

// Роуты только для ADMIN
const ADMIN_ROUTES = ["/admin"];

export default auth(async function proxy(request: NextRequest) {
  const { nextUrl, auth: session } = request as any;
  const pathname = nextUrl.pathname;

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  // Редиректим авторизованных с auth страниц
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Защищённые роуты — только для авторизованных
  if (!isAuthenticated && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin роуты — только для ADMIN
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  // Пропускаем статику и API NextAuth
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
