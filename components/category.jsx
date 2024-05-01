import Product from "./product";

export default function Category({ products, searchParams }) {
    return (
      <section className="h-[80vh] max-h-full min-w-screen z-10">
        <div className="h-full overflow-hidden overflow-y-auto scrollbar-thin">
          {/* <i className=" text-center my-2 block">Filtros</i> */}
          <div className="grid my-4 gap-4 md:grid-cols-2">
            {products.map((product) => (
              <Product key={product._id} product={product} searchParams={searchParams} />
            ))}
          </div>
        </div>
      </section>
    );
  }