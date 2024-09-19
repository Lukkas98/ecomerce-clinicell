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
      <section className=" flex justify-center mt-10 py-3 rounded-xl text-white bg-red-500 h-fit w-[85%] mx-auto">
        <p className=" font-semibold text-lg text-center h-fit">
          {search
            ? `Ups... no encontramos nada con ${search}`
            : "Ups... No encontramos nada por aquí"}
        </p>
      </section>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-6">
        <div className="flex flex-col justify-center items-center gap-5 mb-4">
          <TitleCategory />
          <Filter />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
