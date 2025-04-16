import { ProductModel } from "@/models/product";
import OutletSection from "./components/outletSection";
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

export default async function Home() {
  const added = await ProductModel.find().sort({ _id: -1 }).limit(4);

  return (
    <main className="flex flex-col gap-10 p-4 lg:p-10 bg-gray-900 text-white">
      <HeroSection />
      <OutletSection />
      <section>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 text-center">
          Nuestros Servicios y Productos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full mb-4 flex justify-center items-center">
              <WrenchIcon width={40} height={40} className="text-black" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Reparación de Celulares
            </h3>
            <p className="text-sm text-gray-400 text-center">
              Expertos en reparaciones rápidas y seguras.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500 rounded-full mb-4 flex justify-center items-center">
              <ShoppingBagIcon width={40} height={40} className="text-black" />
            </div>
            <h3 className="text-lg font-medium mb-2">Venta de Accesorios</h3>
            <p className="text-sm text-gray-400 text-center">
              Fundas, protectores y más al mejor precio.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full mb-4 flex justify-center items-center">
              <ComputerDesktopIcon
                width={40}
                height={40}
                className="text-black"
              />
            </div>
            <h3 className="text-lg font-medium mb-2">Artículos Electrónicos</h3>
            <p className="text-sm text-gray-400 text-center">
              Gadgets y tecnología de última generación.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500 rounded-full mb-4 flex items-center justify-center">
              <Cog6ToothIcon width={40} height={40} className="text-black" />
            </div>
            <h3 className="text-lg font-medium mb-2">Repuestos</h3>
            <p className="text-sm text-gray-400 text-center">
              Piezas originales y compatibles de calidad.
            </p>
          </div>
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
