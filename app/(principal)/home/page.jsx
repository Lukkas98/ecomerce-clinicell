import { ProductModel } from "@/models/product";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default async function Home() {
  const outlets = await ProductModel.find({ outlet: true, stock: true }).limit(
    3
  );
  const added = await ProductModel.find().sort({ _id: -1 }).limit(4);

  return (
    <main className="flex flex-col gap-10 p-4 lg:p-10 bg-gray-900 text-white">
      <section className="relative w-full h-[400px] bg-gray-700 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            ¡Reparación & Tecnología al Alcance!
          </h1>
        </div>

        <div className="absolute -top-10 -left-10 w-1/4 h-1/4 bg-blue-500 rotate-12 opacity-70"></div>
        <div className="absolute bottom-5 right-10 w-1/3 h-1/3 bg-cyan-400 rotate-6 opacity-50"></div>
      </section>

      <section className="w-full bg-gradient-to-r from-red-600 to-orange-500 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-semibold mb-2">
          🔥 ¡Productos en Outlet! 🔥
        </h2>
        <p className="text-lg">
          Descuentos imperdibles en productos seleccionados.
        </p>
        <div className="flex gap-4 justify-center mt-4">
          {outlets.map((product) => (
            <div
              key={product._id}
              className="w-32 h-fit p-2 bg-gray-800 rounded-md shadow-md flex gap-2 flex-col justify-center items-center"
            >
              <p className="line-clamp-2">{product.name}</p>
              <Image
                src={product.images[0]}
                width={100}
                height={100}
                alt="imag"
                className="rounded-md"
              />
              <p className=" text-green-500 flex gap-2 items-center font-semibold">
                $ {product.price} <CheckBadgeIcon width={20} height={20} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 text-center">
          Nuestros Servicios y Productos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full mb-4"></div>
            <h3 className="text-lg font-medium mb-2">
              Reparación de Celulares
            </h3>
            <p className="text-sm text-gray-400 text-center">
              Expertos en reparaciones rápidas y seguras.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500 rounded-full mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Venta de Accesorios</h3>
            <p className="text-sm text-gray-400 text-center">
              Fundas, protectores y más al mejor precio.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Artículos Electrónicos</h3>
            <p className="text-sm text-gray-400 text-center">
              Gadgets y tecnología de última generación.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500 rounded-full mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Repuestos</h3>
            <p className="text-sm text-gray-400 text-center">
              Piezas originales y compatibles de calidad.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 text-center">
          📦 Ultimos Agregados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {added.map((product) => (
            <div
              key={product._id}
              className="w-full h-52 p-2 bg-gray-800 rounded-lg shadow-md
              flex flex-col items-center justify-center hover:bg-gray-700 transition-all"
            >
              <div className="relative w-[70%] aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="rounded-lg"
                />
              </div>
              <span className="text-gray-300 font-semibold">
                {product.name}
              </span>
              <span className="text-gray-300">$ {product.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials Section
      <section className="bg-gray-800 rounded-lg p-8">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-center">
          Opiniones de Nuestros Clientes
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="bg-gray-700 p-4 rounded-md shadow-md flex-1">
            <p className="text-gray-300 mb-4">
              Excelente servicio, me repararon el teléfono en tiempo récord y
              quedó como nuevo.
            </p>
            <span className="text-blue-400 font-medium">- Carlos R.</span>
          </div>
          <div className="bg-gray-700 p-4 rounded-md shadow-md flex-1">
            <p className="text-gray-300 mb-4">
              Muy buenos precios en accesorios y artículos electrónicos.
              ¡Recomendado!
            </p>
            <span className="text-blue-400 font-medium">- Mariana G.</span>
          </div>
        </div>
      </section> */}
    </main>
  );
}
