import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    id: "/admin",
    name: "Panel Admin",
    short_name: "Admin",
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/logo192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo512.png", sizes: "512x512", type: "image/png" },
    ],
  });
}
