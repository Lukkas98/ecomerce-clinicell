export const dynamic = "force-dynamic";

import { ProductModel } from "@/models/product";
// import OutletSection from "./components/outletSection";
import {
  WrenchIcon,
  ShoppingBagIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import HeroSection from "./components/heroSection";
import connectDB from "@/lib/ConectDB";
import ProductCard from "../[parentCategory]/[category]/components/productCard";

connectDB();

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
  const added = await ProductModel.find().sort({ _id: -1 }).limit(4);

  return (
    <main className="flex flex-col gap-10 p-4 lg:p-10 bg-gray-900 text-white">
      <HeroSection />
      {/* <OutletSection /> */}

      <section>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 text-center">
          Nuestros Servicios y Productos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gadgets.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center"
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

      <section className="mb-10">
        <h2 className="text-2xl lg:text-3xl font-semibold text-center mb-5">
          📦 Ultimos Agregados
        </h2>
        <div className="grid md:grid-cols-4 gap-6 p-10">
          {added.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
