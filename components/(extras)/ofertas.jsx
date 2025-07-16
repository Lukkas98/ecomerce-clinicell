import Paginate from "@/components/paginate";
import { getProductsAdmin } from "@/lib/actions/products";
import ProductCard from "@/components/productCard";
import { Suspense } from "react";
import Loading from "./loading";

export default async function OffertsPage({ searchParams }) {
  const { page } = await searchParams;

  const { products, totalPages } = await getProductsAdmin(
    "",
    {
      sort: "az",
      stock: ["in-stock"],
      discount: ["with-discount"],
      outlet: [],
    },
    page
  );

  return (
    <Suspense key={Date.now()} fallback={<Loading />}>
      <section className="mb-6 gap-3 below-320:grid-cols-1 grid place-content-center">
        <div className=" space-y-5">
          <h1 className="text-2xl font-bold text-gray-200 text-center mb-4">
            !!Ofertas de la Semana¡¡
          </h1>
          <div className="below-320:col-span-1 col-span-2">
            <Paginate totalPages={totalPages} />
          </div>
          <div className="grid below-320:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 mx-3 lg:mx-5">
            {products.map(async (product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
          <div className="below-320:col-span-1 col-span-2 lg:col-span-3">
            <Paginate totalPages={totalPages} />
          </div>
        </div>
      </section>
    </Suspense>
  );
}
