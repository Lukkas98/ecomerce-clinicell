import { Poppins } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/providers/cartProvider";
import { MenuProvider } from "@/components/providers/menuContext";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "800"],
});

export const metadata = {
  title:
    "Clinic-Cell / Venta de repuestos, accesorios en telefonía y artículos del hogar",
  description:
    "E-comerce de celulares, repuestos, accesorios de celulares y de hogar",
  openGraph: {
    title:
      "Clinic-Cell / Venta y reparación de celulares y artículos del hogar",
    description:
      "Tu tienda de confianza para comprar celulares, repuestos y artículos del hogar. Calidad garantizada.",
    url: "https://clinic-cell.com", // URL completa del sitio
    siteName: "Clinic-Cell",
    // images: [
    //   {
    //     url: process.env.URL_IMAGE_LOGO,
    //     width: 500,
    //     height: 500,
    //     alt: "Clinic-Cell - Venta de celulares y accesorios",
    //   },
    // ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="bg-gray-900 overflow-x-hidden">
      <body className={font.className}>
        <CartProvider>
          <MenuProvider>{children}</MenuProvider>
        </CartProvider>
      </body>
    </html>
  );
}
