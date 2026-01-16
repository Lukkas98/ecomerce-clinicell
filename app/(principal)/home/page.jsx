import {
  WrenchIcon,
  ShoppingBagIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { FaPhone, FaTruck } from "react-icons/fa6";
import HeroSection from "./components/heroSection";
import OffertSection from "./components/offertSection";
import LatestProducts from "./components/latestProducts";

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
  return (
    <main className="flex flex-col gap-10 bg-gray-900 p-4 text-white lg:p-10">
      <HeroSection />
      <OffertSection />

      <section>
        <h2 className="mb-4 text-center text-2xl font-semibold lg:text-3xl">
          Nuestros Servicios y Productos
        </h2>
        <div className="animate-min-pulse grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {gadgets.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-lg border border-blue-900 bg-linear-to-r from-gray-700/80 to-gray-900/80 p-6 shadow-lg"
            >
              <div
                className={`h-16 w-16 ${item.color} mb-4 flex items-center justify-center rounded-full`}
              >
                {item.icon}
              </div>
              <h3 className="mb-2 text-center text-lg font-medium">
                {item.title}
              </h3>
              <p className="text-center text-sm text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="my-4 text-gray-100">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-center text-base font-semibold hover:bg-indigo-700">
            <FaPhone className="text-xl" />
            <a
              target="_blank"
              href="https://wa.me/5492657210777?text=`Hola, estoy interesado en las compras mayoristas`"
              className=""
            >
              Hacé tu consulta por compras mayoristas
            </a>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-green-700 px-4 py-2 text-center text-base font-semibold text-green-50">
            <FaTruck className="animate-bounce text-xl text-green-50" />
            <span>¡Envíos gratis a todo el país!</span>
          </div>
        </div>
      </section>

      <LatestProducts />
    </main>
  );
}
