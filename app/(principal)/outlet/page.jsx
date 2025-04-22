export const dynamic = "force-dynamic";

import Paginate from "@/components/paginate";
import ProductCard from "../[parentCategory]/[category]/components/productCard";
import { getProductsAdmin } from "@/lib/actions/products";

export default async function OutletPage(props) {
  const searchParams = await props.searchParams;
  const { page, filter } = searchParams;

  const { products, totalPages } = await getProductsAdmin(
    "",
    { sort: "az", stock: ["in-stock"], discount: [], outlet: ["outlet"] },
    page
  );

  return (
    <section className="mb-6 gap-3 below-320:grid-cols-1 grid place-content-center">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-200 text-center mb-4">
          Outlet - Liquidación
        </h1>
        <div className="below-320:col-span-1 col-span-2">
          <Paginate totalPages={totalPages} />
        </div>
        <div className="grid below-320:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 mx-3 lg:mx-5">
          {products?.map((product, i) => (
            <ProductCard product={product} key={i} />
          ))}
        </div>
        <div className="below-320:col-span-1 col-span-2 lg:col-span-3">
          <Paginate totalPages={totalPages} />
        </div>
      </div>
    </section>
  );
}
