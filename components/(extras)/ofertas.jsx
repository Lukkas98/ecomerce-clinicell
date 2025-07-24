import Paginate from "@/components/paginate";
import { getProductsAdmin } from "@/lib/actions/products";
import ProductCard from "@/components/productCard";
import { Suspense } from "react";
import Loading from "./loading";

export default async function OffertsPage({ searchParams }) {
  const { page, filter } = await searchParams;
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
      <section className="mb-6 gap-3 grid">
        <div className=" space-y-5">
          <h1 className="text-2xl font-bold text-gray-200 text-center my-10">
            !!Ofertas de la Semana¡¡
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mx-3 lg:mx-5">
            {products.map(async (product, i) => (
              <ProductCard product={product} key={i} />
            ))}
          </div>
          <div className="">
            <Paginate totalPages={totalPages} />
          </div>
        </div>
      </section>
    </Suspense>
  );
}
