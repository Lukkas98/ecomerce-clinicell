"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { useEffect, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function ProductsFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const outletSelected = searchParams.get("outlet") === "true";
  const offerSelected = searchParams.get("offert") === "with-offer";

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateFilters(changes: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(changes).forEach(([name, value]) => {
      if (value) params.set(name, value);
      else params.delete(name);
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}` as Route, { scroll: false });
    });
  }

  const updateSearch = useDebouncedCallback((value: string) => {
    updateFilters({ search: value || undefined });
  }, 400);

  return (
    <div className={`mb-5 rounded-2xl border border-slate-200 bg-white p-3 ${isPending ? "opacity-70" : ""}`}>
      <div className="flex gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <SearchIcon />
          </span>
          <input
            className="h-10 w-full rounded-xl bg-slate-100 pl-9 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
            onChange={(event) => {
              setSearch(event.target.value);
              updateSearch(event.target.value);
            }}
            placeholder="Buscar..."
            type="search"
            value={search}
          />
        </label>
        <button
          aria-label="Limpiar filtros"
          className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-500"
          onClick={() => {
            updateSearch.cancel();
            setSearch("");
            startTransition(() => router.replace(pathname as Route, { scroll: false }));
          }}
          type="button"
        >
          Limpiar
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <FilterGroup
          name="stock"
          options={[
            ["in-stock", "Stock"],
            ["out-of-stock", "Sin stock"],
          ]}
          selected={searchParams.get("stock") ?? undefined}
          onChange={(name, value) => updateFilters({ [name]: value })}
        />
        <FilterGroup
          name="offert"
          options={[
            ["with-offer", "Oferta"],
            ["without-offer", "Sin oferta"],
          ]}
          selected={searchParams.get("offert") ?? undefined}
          disabledValue={outletSelected ? "with-offer" : undefined}
          onChange={(name, value) => updateFilters({ [name]: value })}
        />
        <label className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold ring-1 ${
          outletSelected ? "bg-blue-600 text-white ring-blue-600" : "bg-white text-slate-500 ring-slate-200"
        }`}>
          <input
            checked={outletSelected}
            className="sr-only"
            onChange={(event) => {
              const nextOutlet = event.target.checked;
              updateFilters({
                outlet: nextOutlet ? "true" : undefined,
                offert: nextOutlet && offerSelected ? undefined : searchParams.get("offert") ?? undefined,
              });
            }}
            type="checkbox"
          />
          Outlet
        </label>
      </div>
    </div>
  );
}

function FilterGroup({
  name,
  options,
  selected,
  disabledValue,
  onChange,
}: {
  name: string;
  options: string[][];
  selected?: string;
  disabledValue?: string;
  onChange: (name: string, value?: string) => void;
}) {
  return (
    <>
      {options.map(([value, label]) => {
        const disabled = value === disabledValue;
        return (
          <label className={`flex h-8 cursor-pointer items-center rounded-full px-3 text-xs font-semibold ring-1 ${
            disabled
              ? "cursor-not-allowed bg-slate-100 text-slate-300 ring-slate-100"
              : selected === value
                ? "bg-blue-600 text-white ring-blue-600"
                : "bg-white text-slate-500 ring-slate-200"
          }`} key={value}>
            <input
              checked={selected === value}
              className="sr-only"
              disabled={disabled}
              name={name}
              onChange={() => onChange(name, value)}
              type="radio"
            />
            {label}
          </label>
        );
      })}
    </>
  );
}

function SearchIcon() {
  return <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}
