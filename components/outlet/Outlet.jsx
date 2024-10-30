import { ProductModel } from "@/models/product.js";
import ProductOutlet from "./productOutlet";
import Link from "next/link";

export default async function Outlet() {
  const products = await ProductModel.find({ outlet: true, stock: true })
    .sort({
      name: 1,
    })
    .limit(6);

  return (
    <>
      {products.length > 0 && (
        <div className="bg-gray-900 text-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-orange-400 mb-4 text-center">
            Outlet - Liquidación
          </h2>

          <div className="flex space-x-4 overflow-x-auto ">
            {products.map((product) => (
              <ProductOutlet key={product._id} product={product} />
            ))}
          </div>

          <Link
            href={"/outlet"}
            className="my-4 inline-block bg-orange-500 text-gray-900 font-semibold px-2 py-1 rounded-lg hover:bg-orange-600"
          >
            Ver más
          </Link>
        </div>
      )}
    </>
  );
}
