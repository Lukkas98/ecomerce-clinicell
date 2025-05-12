import connectDB from "@/lib/ConectDB";
import { ProductModel } from "@/models/product";
import Link from "next/link";
import ProductOffer from "./productOffert";

export default async function OffertSection() {
  await connectDB();
  const result = await ProductModel.aggregate([
    {
      $match: {
        discount: { $gt: 0 },
        stock: true,
      },
    },
    {
      $facet: {
        products: [{ $limit: 4 }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const products = result[0].products;
  const total = result[0].totalCount[0]?.count || 0;

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-r from-red-600/90 to-orange-500/90 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">
      <div className="text-center space-y-2 md:space-y-3">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
          <Link
            href="/ofertas"
            className="hover:text-blue-300 transition-colors text-lg"
          >
            <span className="animate-pulse text-2xl md:text-3xl">🔥</span>
            ¡Ofertas De La Semana!
            <span className="animate-pulse text-2xl md:text-3xl">🔥</span>
          </Link>
        </h2>

        <p className="text-sm md:text-base lg:text-lg">
          Descuentos exclusivos -{" "}
          <Link
            href="/ofertas"
            className="underline font-medium hover:text-blue-300"
          >
            Ver todos ({total})
          </Link>
        </p>
      </div>

      <div className="mt-4 md:mt-6 lg:mt-8">
        <div className="flex flex-col md:flex-wrap items-center justify-center gap-2">
          {products.map((product) => (
            <div key={product._id} className="w-full max-w-[250px]">
              <ProductOffer product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
