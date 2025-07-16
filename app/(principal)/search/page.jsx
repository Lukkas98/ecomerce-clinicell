import Paginate from "@/components/paginate";
import { getProductsAdmin } from "@/lib/actions/products";
import ProductCard from "@/components/productCard";
import { Suspense } from "react";
import Loading from "@/components/(extras)/loading";

export default async function SearchPage({ searchParams }) {
  const { q, page } = await searchParams;

  const { products, totalPages } = await getProductsAdmin(
    q,
    { sort: "az", stock: ["in-stock"], discount: [], outlet: [] },
    page
  );

  return (
    <Suspense fallback={<Loading />} key={Date.now()}>
      <section className="mb-6 gap-3 below-320:grid-cols-1 grid place-content-center">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-200 text-center mb-4">
            Busqueda - {q}
          </h1>
          <div className="below-320:col-span-1 col-span-2">
            <Paginate totalPages={totalPages} />
          </div>
          <div className="grid below-320:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 mx-3 lg:mx-5 my-4">
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
