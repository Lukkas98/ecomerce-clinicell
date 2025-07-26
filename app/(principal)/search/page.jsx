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
    page,
  );

  return (
    <Suspense fallback={<Loading />} key={Date.now()}>
      <section className="below-320:grid-cols-1 mb-6 grid place-content-center gap-3">
        <div className="">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-200">
            Busqueda - {q}
          </h1>
          <div className="mx-3 my-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mx-5 lg:grid-cols-3 xl:grid-cols-4">
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
