import ProductOutlet from "@/components/outlet/productOutlet";
import { ProductModel } from "@/models/product";
import Link from "next/link";

export default async function OutletSection() {
  const products = await ProductModel.find({ outlet: true, stock: true }).limit(
    3
  );
  const totalProducts = await ProductModel.countDocuments({
    outlet: true,
    stock: true,
  });

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-r from-red-600 to-orange-500 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">
      <div className="text-center space-y-2 md:space-y-3">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
          <span className="animate-pulse text-2xl md:text-3xl">🔥</span>{" "}
          <Link
            href="/outlet"
            className="hover:text-orange-900 transition-colors text-lg"
          >
            ¡Ofertas en Outlet!
          </Link>{" "}
          <span className="animate-pulse text-2xl md:text-3xl">🔥</span>
        </h2>

        <p className="text-sm md:text-base lg:text-lg">
          Descuentos exclusivos -{" "}
          <Link href="/outlet" className="underline font-medium">
            Ver todos ({totalProducts})
          </Link>
        </p>
      </div>

      <div className="mt-4 md:mt-6 lg:mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {products.map((product) => (
            <div key={product._id} className="w-full max-w-[250px]">
              <ProductOutlet product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
