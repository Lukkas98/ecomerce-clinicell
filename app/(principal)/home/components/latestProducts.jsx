import ProductCard from "@/components/productCard";
import connectDB from "@/lib/ConectDB";
import { ProductModel } from "@/models/product";
import { Suspense } from "react";

export default async function LatestProducts() {
  await connectDB();
  const latestProd = await ProductModel.find({
    stock: true,
    discount: 0,
    outlet: false,
  })
    .sort({ updatedAt: -1 })
    .limit(4);

  return (
    <section className="mb-10">
      <h2 className="text-xl lg:text-2xl font-semibold text-center mb-4">
        📦 Ultimos reingresos
      </h2>
      <div className="grid md:grid-cols-4 gap-6 p-1">
        <Suspense fallback={<div className="text-center">Cargando...</div>}>
          {latestProd.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Suspense>
      </div>
    </section>
  );
}
