import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clinicell Dashboard",
    short_name: "Clinicell",
    description: "Panel móvil para administrar tu catálogo y pagos.",
    id: "/admin",
    start_url: "/admin",
    scope: "/admin",
    display: "fullscreen",
    orientation: "portrait",
    background_color: "#f6f8fc",
    theme_color: "#315efb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
