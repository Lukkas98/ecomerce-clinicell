import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AdminID = process.env.ADMIN_UUID;

export function middleware(req) {
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");
  const pathname = req.nextUrl.pathname;

  if (!admin && pathname.startsWith("/admin/")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (admin && admin.value === AdminID && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/panel", req.url));
  }
  if (admin && admin.value !== AdminID && pathname.startsWith("/admin/")) {
    return NextResponse.redirect(new URL("/home/Todos", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
