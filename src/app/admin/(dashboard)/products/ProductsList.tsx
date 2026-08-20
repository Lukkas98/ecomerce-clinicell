"use client";

import { useMemo, useState } from "react";
import type { ProductDTO } from "@/lib/types/products";

export default function ProductsList({ products }: { products: ProductDTO[] }) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "available" && product.stock > 0) ||
        (stockFilter === "empty" && product.stock === 0);

      return matchesSearch && matchesStock;
    });
  }, [products, search, stockFilter]);

  return (
    <>
      <div className="mb-5 space-y-3">
        <label className="relative block">
          <span className="sr-only">Buscar productos</span>
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            <SearchIcon />
          </span>
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar productos..."
            type="search"
            value={search}
          />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500">Filtrar:</span>
          {[
            { value: "all", label: "Todos" },
            { value: "available", label: "En stock" },
            { value: "empty", label: "Sin stock" },
          ].map((filter) => (
            <button
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                stockFilter === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-200"
              }`}
              key={filter.value}
              onClick={() => setStockFilter(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs font-medium text-slate-500">
        {filteredProducts.length} producto{filteredProducts.length === 1 ? "" : "s"}
      </p>

      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <article className="dashboard-card flex items-center gap-3 p-3" key={product._id}>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
              {product.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" className="h-full w-full object-cover" src={product.images[0].url} />
              ) : (
                <PackageIcon />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold">{product.name}</h2>
              <p className="mt-1 truncate text-xs text-slate-500">{product.description}</p>
              <p className="mt-2 text-sm font-bold text-blue-600">
                ${product.calculatedPrice.toLocaleString("es-AR")}
              </p>
            </div>
            <span className={`self-start rounded-full px-2 py-1 text-[10px] font-semibold ${
              product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}>
              {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
            </span>
          </article>
        ))}
        {filteredProducts.length === 0 ? (
          <div className="dashboard-card p-8 text-center text-sm text-slate-500">
            No se encontraron productos.
          </div>
        ) : null}
      </div>
    </>
  );
}

function SearchIcon() {
  return <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}

function PackageIcon() {
  return <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="m4 8 8-4 8 4v9l-8 4-8-4V8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /><path d="m4 8 8 4 8-4M12 12v9" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}
