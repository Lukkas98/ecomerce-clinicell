import { Suspense } from "react";
import ProductsFilters from "./components/ProductsFilters";
import ProductsContent from "./components/ProductsContent";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function ProductsLoading() {
  return (
    <div className="dashboard-card p-8 text-center text-sm text-slate-500">
      Cargando...
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="dashboard-content">
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Productos</h1>
      <ProductsFilters />
      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
