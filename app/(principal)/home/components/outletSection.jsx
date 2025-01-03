import { ProductModel } from "@/models/product";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default async function OutletSection() {
  const products = await ProductModel.find({ outlet: true, stock: true }).limit(
    3
  );

  return (
    <section className="w-full bg-gradient-to-r from-red-600 to-orange-500 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-semibold mb-2">
        <span className="animate-pulse">🔥</span> ¡Productos en Outlet!{" "}
        <span className="animate-pulse">🔥</span>
      </h2>
      <p className="text-lg">
        Descuentos imperdibles en productos seleccionados.
      </p>
      <div className="flex gap-4 justify-center mt-4">
        {products.map((product) => (
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
  );
}
