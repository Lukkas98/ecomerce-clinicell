import { Poppins } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/(cart)/cartProvider";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "800"],
});

export const metadata = {
  title:
    "Clinic-Cell / Venta de repuestos, accesorios en telefonía y artículos del hogar",
  description:
    "E-comerce de celulares, repuestos, accesorios de celulares y de hogar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="bg-gray-900">
      <body className={font.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
