import { getFilteredProducts } from "@/lib/data/products";
import type { FilterOptions } from "@/models/productModel";
import ProductsGrid from "./ProductsGrid";

type ProductFilters = NonNullable<FilterOptions["filters"]>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const stock = firstValue(params.stock);
  const offert = firstValue(params.offert);
  const search = firstValue(params.search);
  const filters: ProductFilters = {
    stock: stock === "in-stock" || stock === "out-of-stock" ? [stock] : undefined,
    offert: offert === "with-offer" || offert === "without-offer" ? [offert] : undefined,
    outlet: firstValue(params.outlet) === "true" ? true : undefined,
  };
  const result = await getFilteredProducts(
    {
      search,
      filters,
    },
    1,
  );

  return (
    <>
      <p className="mb-3 text-xs font-medium text-slate-500">
        {result.totalProducts} producto{result.totalProducts === 1 ? "" : "s"}
      </p>
      <ProductsGrid products={result.products} />
    </>
  );
}
