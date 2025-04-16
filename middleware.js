import { NextResponse } from "next/server";
import { verifySession } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = await verifySession();

  // Ruta de login siempre permitida
  if (pathname === "/admin") {
    if (isAuthenticated)
      return NextResponse.redirect(new URL("/admin/panel", request.url));

    return NextResponse.next();
  }

  // Verificar rutas protegidas
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
