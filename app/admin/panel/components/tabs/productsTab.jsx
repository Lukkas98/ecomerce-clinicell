import Paginate from "@/components/paginate";
import LoadingProducts from "@/components/loadingProducts";
import { Suspense } from "react";
import Product from "../product";

export default async function ProductsTab({ data }) {
  const totalPages = data.totalPages;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12 justify-center">
      <div className="md:col-span-2 lg:col-span-3">
        <Paginate totalPages={totalPages} />
      </div>

      <Suspense key={Date.now()} fallback={<LoadingProducts />}>
        {data.products?.map((item) => (
          <Product key={item._id} product={item} />
        ))}
      </Suspense>

      <div className="md:col-span-2 lg:col-span-3">
        <Paginate totalPages={totalPages} />
      </div>
    </div>
  );
}
