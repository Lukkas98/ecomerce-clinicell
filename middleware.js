import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AdminTrue = process.env.ADMIN_TRUE;

export function middleware(req) {
  // console.log("Middleware ejecutándose...");
  const cookieStore = cookies();
  const admin = cookieStore.get("admin");
  const pathname = req.nextUrl.pathname;

  if (pathname === "/admin" && admin.value === AdminTrue) {
    NextResponse.redirect(new URL("/admin/panel", req.url));
    return NextResponse.next();
  }

  // if (pathname === "/admin") {
  //   return NextResponse.next();
  // }

  if (pathname.startsWith("/admin/panel") && admin.value !== AdminTrue) {
    return NextResponse.redirect(new URL("/home/todos", req.url));
  }

  if (pathname.startsWith("/admin/panel") && admin.value === AdminTrue) {
    NextResponse.redirect(new URL(pathname, req.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
