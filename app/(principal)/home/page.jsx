export const dynamic = "force-dynamic";

import { ProductModel } from "@/models/product";
import {
  WrenchIcon,
  ShoppingBagIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { FaPhone, FaCircleCheck } from "react-icons/fa6";
import HeroSection from "./components/heroSection";
import connectDB from "@/lib/ConectDB";
import ProductCard from "@/components/productCard";
import { Suspense } from "react";
import OffertSection from "./components/offertSection";

const gadgets = [
  {
    icon: <WrenchIcon width={40} height={40} className="text-black" />,
    color: "bg-blue-500",
    title: "Reparación de Celulares",
    description: "Expertos en reparaciones rápidas y seguras.",
  },
  {
    icon: <ShoppingBagIcon width={40} height={40} className="text-black" />,
    color: "bg-green-500",
    title: "Venta de Accesorios",
    description: "Fundas, protectores y más al mejor precio.",
  },
  {
    icon: <ComputerDesktopIcon width={40} height={40} className="text-black" />,
    color: "bg-yellow-500",
    title: "Artículos Electrónicos",
    description: "Gadgets y tecnología de última generación.",
  },
  {
    icon: <Cog6ToothIcon width={40} height={40} className="text-black" />,
    color: "bg-red-500",
    title: "Repuestos",
    description: "Piezas originales y compatibles de calidad.",
  },
];

export default async function Home() {
  await connectDB();
  const added = await ProductModel.find().sort({ timeUpdated: -1 }).limit(4);

  return (
    <main className="flex flex-col gap-10 p-4 lg:p-10 bg-gray-900 text-white">
      <HeroSection />
      <OffertSection />

      <section>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 text-center">
          Nuestros Servicios y Productos
        </h2>
        <div className="grid grid-cols-1 animate-min-pulse md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gadgets.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-r from-gray-700/80 to-gray-900/80 border border-blue-900 rounded-lg shadow-lg flex flex-col items-center"
            >
              <div
                className={`w-16 h-16 ${item.color} rounded-full mb-4 flex justify-center items-center`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 text-center">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-gray-100 my-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 hover:scale-105 transition-transform">
            <a
              target="_blank"
              href="https://www.google.com"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <FaPhone className="inline" />
              Hacé tu consulta por compras mayoristas
            </a>
          </div>

          <div className="flex items-center gap-2 text-lg">
            <FaCircleCheck className="inline text-green-500" />
            <span>Envíos gratis a todo el País</span>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center">
          📦 Ultimos Agregados
        </h2>
        <div className="grid md:grid-cols-4 gap-6 p-10">
          <Suspense fallback={<div className="text-center">Cargando...</div>}>
            {added.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </Suspense>
        </div>
      </section>
    </main>
  );
}
