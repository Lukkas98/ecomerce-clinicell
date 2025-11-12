import { Poppins } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/providers/cartProvider";
import { MenuProvider } from "@/components/providers/menuContext";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "800"],
});

export const metadata = {
  metadataBase: new URL("https://ecomerce-clinicell.vercel.app"),
  title:
    "Clinic-Cell / Venta de repuestos, accesorios en telefonía y artículos del hogar",
  description:
    "E-comerce de celulares, repuestos, accesorios de celulares y de hogar",
  openGraph: {
    title:
      "Clinic-Cell / Venta y reparación de celulares y artículos del hogar",
    description:
      "Tu tienda de confianza para comprar celulares, repuestos y artículos del hogar. Calidad garantizada.",
    url: "https://ecomerce-clinicell.vercel.app",
    siteName: "Clinic-Cell",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="overflow-x-hidden bg-gray-900">
      <body className={font.className}>
        <CartProvider>
          <MenuProvider>{children}</MenuProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
