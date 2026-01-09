"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import FilterDropdown from "./filterDropdown";
import FilterActions from "./filterActions";
import FilterMobileToggle from "./filterMobileToggle";

const filterOptions = {
  stock: [
    { label: "Con stock", value: "in-stock" },
    { label: "Sin stock", value: "out-of-stock" },
    { label: "Todos", value: "" },
  ],
  discount: [
    { label: "Con descuento", value: "with-discount" },
    { label: "Sin descuento", value: "without-discount" },
    { label: "Todos", value: "" },
  ],
  outlet: [
    { label: "Outlet", value: "outlet" },
    { label: "Todos", value: "" },
  ],
};

export default function AdminFilter() {
  const [selectedFilters, setSelectedFilters] = useState({
    stock: "",
    discount: "",
    outlet: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setSelectedFilters({
      stock: searchParams.get("stock") || "",
      discount: searchParams.get("discount") || "",
      outlet: searchParams.get("outlet") || "",
    });
  }, [searchParams]);

  const hasAnyFilter = Object.values(selectedFilters).some((v) => v);
  const filterCount = Object.values(selectedFilters).filter((v) => v).length;

  function handleSelect(filterType, value) {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev, [filterType]: value };
      if (filterType === "discount" && value === "with-discount") {
        newFilters.outlet = "";
      }
      if (filterType === "outlet" && value) {
        newFilters.discount = "";
      }
      return newFilters;
    });
    setOpenDropdown(null);
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    Object.keys(selectedFilters).forEach((key) => params.delete(key));
    setSelectedFilters({ stock: "", discount: "", outlet: "" });
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="z-50 w-10 bg-gray-800 shadow-lg md:relative md:mx-auto md:max-w-4xl md:rounded-lg md:p-4">
      <FilterMobileToggle
        filterCount={filterCount}
        isOpen={isMobileOpen}
        onToggle={() => setMobileOpen(!isMobileOpen)}
      />
      <div
        className={`${
          isMobileOpen ? "fixed left-0 block w-full" : "hidden"
        } overflow-hidden bg-gray-800 transition-all duration-300 md:block`}
      >
        <div className="p-4 md:p-0">
          <div className="flex flex-col items-end gap-4 md:flex-row md:flex-wrap">
            {Object.keys(filterOptions).map((type) => (
              <FilterDropdown
                key={type}
                filterType={type}
                label={
                  type === "stock"
                    ? "Stock"
                    : type === "discount"
                      ? "Descuento"
                      : "Outlet"
                }
                options={filterOptions[type]}
                selectedValue={selectedFilters[type]}
                onSelect={handleSelect}
                disableWhile={
                  type === "discount"
                    ? !!selectedFilters.outlet
                    : type === "outlet"
                      ? selectedFilters.discount === "with-discount"
                      : false
                }
                allowNone={hasAnyFilter}
                isOpen={openDropdown === type}
                onToggle={() =>
                  setOpenDropdown(openDropdown === type ? null : type)
                }
              />
            ))}
            <FilterActions
              hasFilters={hasAnyFilter}
              applyFilters={() => {
                applyFilters();
                setMobileOpen(false);
              }}
              clearFilters={() => {
                clearFilters();
                setMobileOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
