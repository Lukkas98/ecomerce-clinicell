import { Suspense } from "react";
import Paginate from "./paginate";
import ProductCard from "./productCard";
import Filter from "./filter";

export default function Category({
  products = [],
  searchParams,
  totalPages = 1,
}) {
  const { search } = searchParams;
  return (
    <section className="min-h-[80vh] lg:h-fit min-w-screen z-10 flex flex-col justify-between">
      <div className="h-full overflow-hidden overflow-y-auto scrollbar-thin lg:grid">
        <Filter />
        {products.length <= 0 && (
          <div className=" flex justify-center mt-10 py-3 rounded-xl text-white bg-red-500 h-fit w-[85%] mx-auto">
            <p className=" font-semibold text-lg text-center h-fit">
              {search
                ? `Ups... no encontramos nada con ${search}`
                : "Ups... No encontramos nada por aquí"}
            </p>
          </div>
        )}
        <Suspense fallback={<LoadingProducts />} key={Date.now()}>
          {products.length > 0 && (
            <div className="grid my-6 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  searchParams={searchParams}
                />
              ))}
            </div>
          )}
        </Suspense>
      </div>
      <Paginate totalPages={totalPages} />
    </section>
  );
}

function LoadingProducts() {
  return (
    <div className="grid my-6 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array(9)
        .fill("")
        .map((_, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-lg bg-gray-200 p-4 shadow-md"
          >
            <div className="w-full h-40 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
          </div>
        ))}
    </div>
  );
}
