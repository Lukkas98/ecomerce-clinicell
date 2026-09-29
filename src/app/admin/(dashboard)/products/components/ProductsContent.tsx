import { getFilteredProducts } from "@/lib/data/products";
import type { FilterOptions } from "@/models/productModel";
import type { Route } from "next";
import Link from "next/link";
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
  const requestedPage = Number(firstValue(params.page) ?? "1");
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const filters: ProductFilters = {
    stock:
      stock === "in-stock" || stock === "out-of-stock" ? [stock] : undefined,
    offert:
      offert === "with-offer" || offert === "without-offer"
        ? [offert]
        : undefined,
    outlet: firstValue(params.outlet) === "true" ? true : undefined,
  };
  let result = await getFilteredProducts(
    {
      search,
      filters,
    },
    page,
  );
  const totalPages = Math.max(result.totalPages, 1);
  const currentPage = Math.min(page, totalPages);
  if (currentPage !== page) {
    result = await getFilteredProducts(
      {
        search,
        filters,
      },
      currentPage,
    );
  }

  return (
    <>
      <p className="mb-3 text-xs font-medium text-slate-500">
        {result.totalProducts} producto{result.totalProducts === 1 ? "" : "s"}
        {result.totalPages > 1 ? (
          <span className="ml-1 text-slate-400">
            · Página {currentPage} de {totalPages}
          </span>
        ) : null}
      </p>
      <ProductsGrid products={result.products} />
      {totalPages > 1 ? (
        <ProductsPagination
          currentPage={currentPage}
          searchParams={params}
          totalPages={totalPages}
        />
      ) : null}
    </>
  );
}

function ProductsPagination({
  currentPage,
  searchParams,
  totalPages,
}: {
  currentPage: number;
  searchParams: Record<string, string | string[] | undefined>;
  totalPages: number;
}) {
  const pages = getVisiblePages(currentPage, totalPages);

  function getPageHref(page: number): Route {
    const query = new URLSearchParams();

    Object.entries(searchParams).forEach(([name, value]) => {
      if (name === "page" || value === undefined) return;
      query.set(name, Array.isArray(value) ? value[0] : value);
    });

    if (page > 1) query.set("page", String(page));
    const queryString = query.toString();

    return (
      queryString ? `/admin/products?${queryString}` : "/admin/products"
    ) as Route;
  }

  return (
    <nav
      aria-label="Paginación de productos"
      className="mt-5 flex items-center justify-center gap-1.5"
    >
      {currentPage > 1 ? (
        <Link
          aria-label="Página anterior"
          className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          href={getPageHref(currentPage - 1)}
          prefetch={false}
        >
          <PaginationArrow />
          <span className="hidden sm:inline">Anterior</span>
        </Link>
      ) : null}

      {pages.map((page) => (
        <Link
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Página ${page}`}
          className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-xs font-bold transition-colors ${
            page === currentPage
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
              : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          }`}
          href={getPageHref(page)}
          key={page}
          prefetch={false}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          aria-label="Página siguiente"
          className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          href={getPageHref(currentPage + 1)}
          prefetch={false}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <PaginationArrow />
        </Link>
      ) : null}
    </nav>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pageCount = Math.min(totalPages, 5);
  const firstPage = Math.min(
    Math.max(currentPage - Math.floor(pageCount / 2), 1),
    totalPages - pageCount + 1,
  );

  return Array.from({ length: pageCount }, (_, index) => firstPage + index);
}

function PaginationArrow() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m14 6-6 6 6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
