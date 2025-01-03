import ProductOutlet from "@/components/outlet/productOutlet";
import { ProductModel } from "@/models/product";
import Link from "next/link";

export default async function OutletSection() {
  const products = await ProductModel.find({ outlet: true, stock: true }).limit(
    3
  );

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-r from-red-600 to-orange-500 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-semibold mb-2">
        <span className="animate-pulse">🔥</span> ¡Productos en{" "}
        <Link href={"/outlet"} className="text-orange-900">
          Outlet!
        </Link>{" "}
        <span className="animate-pulse">🔥</span>
      </h2>
      <p className="text-lg">
        Descuentos imperdibles en productos seleccionados.{" "}
        <Link href={"/outlet"} className="underline text-sm">
          Ver Más
        </Link>
      </p>
      <div className="flex gap-4 justify-center mt-4">
        {products.map((product) => (
          <ProductOutlet key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
