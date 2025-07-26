import Paginate from "@/components/paginate";
import LoadingProducts from "@/components/loadingProducts";
import { Suspense } from "react";
import Product from "../product";

export default async function ProductsTab({ data }) {
  const totalPages = data.totalPages;

  return (
    <div className="mb-17 grid gap-4">
      <Paginate totalPages={totalPages} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense key={Date.now()} fallback={<LoadingProducts />}>
          {data.products?.map((item) => (
            <Product key={item._id} product={item} />
          ))}
        </Suspense>
      </div>

      <Paginate totalPages={totalPages} />
    </div>
  );
}
