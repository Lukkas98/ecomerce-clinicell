"use client";
import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import Image from "next/image";
import { useMenu } from "../../../providers/menuContext";

export default function ClientInput({ products = [] }) {
  const { closeMenu } = useMenu();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!search) return [];
    const searchTerm = search.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }, [search, products]);

  // Mostrar solo los primeros 3 resultados
  const displayedProducts = filteredProducts.slice(0, 3);
  const hasMoreResults = filteredProducts.length > 3;

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearch(value);
  }, 400);

  const handleNavigation = () => {
    closeMenu();
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        onChange={(e) => debouncedSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder="Buscar productos..."
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />

      {isFocused && search && (
        <div className="absolute z-10 md:w-[300%] w-full lg:w-full mt-1.5s bg-gray-700 border border-gray-500 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {displayedProducts.length > 0 ? (
            <>
              {displayedProducts.map((product) => (
                <Link
                  href={product.url}
                  key={product._id}
                  className="p-4 hover:bg-gray-800 flex flex-col cursor-pointer border-b last:border-b-0 transition-colors text-white border-gray-500"
                  onClick={handleNavigation}
                >
                  <div className="flex gap-3.5">
                    <Image
                      src={
                        product.images[0]?.url ??
                        "https://fakeimg.pl/80x80/c2c2c2/808080?text=Sin+Imagen&font=bebas"
                      }
                      alt={product.name}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {hasMoreResults && (
                <Link
                  href={`/search?q=${encodeURIComponent(search)}`}
                  className="block p-4 text-center text-blue-300 hover:bg-gray-800 transition-colors font-medium"
                  onClick={handleNavigation}
                >
                  Ver todas las coincidencias ({filteredProducts.length})
                </Link>
              )}
            </>
          ) : (
            <div className="p-4 text-gray-500">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
