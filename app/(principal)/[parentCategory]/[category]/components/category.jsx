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
      <section className="container mx-auto px-4 py-6 flex flex-col items-center">
        <TitleCategory />
        <div className=" flex justify-center items-center my-20 w-[85%] mx-auto">
          <p className=" font-semibold text-base lg:text-xl text-center h-fit text-gray-200 bg-red-700 py-2 px-3 rounded-lg">
            Ups... No encontramos nada por aquí
          </p>
        </div>
      </section>
    );

  return (
    <div className="container px-2 py-3">
      <section className="mb-6">
        <div className="flex flex-col justify-center items-center gap-5 mb-4">
          <TitleCategory />
          <Filter />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <Suspense fallback={<LoadingProducts />} key={Date.now()}>
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
