import InputSearch from "./(header)/(search)/inputSearch";
import ProductCard from "./productCard";

export default function Category({ products, searchParams }) {
  const { search } = searchParams;
  return (
    <section className="min-h-[80vh] max-h-full min-w-screen z-10">
      <div className="h-full overflow-hidden overflow-y-auto scrollbar-thin lg:grid">
        <div className="flex justify-around w-full my-2">
          <InputSearch />
          {/* <select name="" id="">
            <option value="">Filtrado1</option>
            <option value="">Filtrado2</option>
          </select> */}
        </div>
        {products.length <= 0 && (
          <div className=" flex justify-center mt-10 py-3 rounded-xl text-white bg-red-500 w-[85%] mx-auto">
            <p className=" font-semibold text-lg text-center">
              {search
                ? `Ups... no encontramos nada con ${search}`
                : "Ups... No encontramos nada por aquí"}
            </p>
          </div>
        )}
        {products.length > 0 && (
          <div className="grid my-4 gap-4 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                searchParams={searchParams}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
