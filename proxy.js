import { NextResponse } from "next/server";
import { verifySession } from "./lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Modo de mantenimiento activado
  if (maintenanceMode) {
    // Excluir rutas esenciales
    const excludedPaths = ["/maintenance", "/_next/", "/favicon.ico"];

    const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));

    if (!isExcluded) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
    return NextResponse.next();
  }
  // Si no está en modo de mantenimiento
  if (pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // (solo si no está en mantenimiento)
  const isAuthenticated = await verifySession();

  if (pathname === "/admin") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/panel", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|assets).*)"],
};
