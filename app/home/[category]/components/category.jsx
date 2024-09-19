import { Suspense } from "react";
import ProductCard from "./productCard";
import Filter from "./filter";
import Paginate from "@/components/paginate";
import LoadingProducts from "@/components/loadingProducts";
import TitleCategory from "./titleCategory";

export default function Category({
  products = [],
  searchParams,
  totalPages = 1,
}) {
  const { search } = searchParams;

  if (!products.length)
    return (
      <section className="container mx-auto px-4 py-6 grid place-items-center">
        <TitleCategory />
        <div className=" flex justify-center items-center my-20 h-[40vh] w-[85%] mx-auto">
          <p className=" font-semibold text-lg text-center h-fit text-gray-200 bg-red-600 py-3 px-4 rounded-lg">
            {search
              ? `Ups... no encontramos nada con ${search}`
              : "Ups... No encontramos nada por aquí"}
          </p>
        </div>
      </section>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-6">
        <div className="flex flex-col justify-center items-center gap-5 mb-4">
          <TitleCategory />
          <Filter />
        </div>

        <div className="grid below-320:grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
