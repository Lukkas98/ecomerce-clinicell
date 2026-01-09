import { Suspense } from "react";
import ProductCard from "../../../../../components/productCard";
import Filter from "./filter";
import Paginate from "@/components/paginate";
import LoadingProducts from "@/components/loadingProducts";
import TitleCategory from "./titleCategory";

export default function Category({
  products = [],
  searchParams,
  totalPages = 1,
}) {
  if (!products.length)
    return (
      <section className="container mx-auto flex flex-col items-center px-4 py-6">
        <TitleCategory />
        <div className="mx-auto my-20 flex w-[85%] items-center justify-center">
          <p className="h-fit rounded-lg bg-red-700 px-3 py-2 text-center text-base font-semibold text-gray-200 lg:text-xl">
            Ups... No encontramos nada por aquí
          </p>
        </div>
      </section>
    );

  return (
    <div className="container px-2 py-3">
      <section className="mb-6">
        <div className="mb-4 flex flex-col items-center justify-center gap-5">
          <TitleCategory />
          <Filter />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Suspense fallback={<LoadingProducts />}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                searchParams={searchParams}
              />
            ))}
          </Suspense>
        </div>
      </section>
      <Paginate totalPages={totalPages} />
    </div>
  );
}
