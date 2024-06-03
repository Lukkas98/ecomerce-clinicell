import { Exo_2 } from "next/font/google";
import "toastify-js/src/toastify.css";
import "./globals.css";
import CartProvider from "@/components/(header)/(cart)/cartProvider";

const font = Exo_2({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "800"],
});

export const metadata = {
  title: "Clinic-Cell / Venta y reparación de celulares",
  description: "E-comerce de celulares y repuestos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="bg-teal-50">
      <body className={font.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
