import Paginate from "@/components/paginate";
import ProductCard from "@/components/productCard";
import { getProductsAdmin } from "@/lib/actions/products";
import { Suspense } from "react";
import Loading from "./loading";

export default async function OutletPage({ searchParams }) {
  const { page, filter } = await searchParams;

  const { products, totalPages } = await getProductsAdmin(
    "",
    { sort: "az", stock: ["in-stock"], discount: [], outlet: ["outlet"] },
    page
  );

  return (
    <Suspense fallback={<Loading />} key={Date.now()}>
      <section className="mb-6 ">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-200 text-center mb-4">
            Outlet - Liquidación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mx-3 lg:mx-5">
            {products?.map((product, i) => (
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
