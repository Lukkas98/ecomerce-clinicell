"use client";
import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { searchProducts } from "@/lib/actions/products";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMenu } from "../../../providers/menuContext";
import { useRouter } from "next/navigation";

export default function ClientSearch() {
  const { closeMenu } = useMenu();
  const [search, setSearch] = useState("");
  // const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    closeMenu();
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form
        onSubmit={handleOnSubmit}
        className="flex items-center gap-2 justify-center my-3"
      >
        <input
          type="text"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          defaultValue={""}
          // onFocus={() => setIsFocused(true)}
          // onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Buscar productos..."
          className="w-[80%] px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button type="submit">
          <MagnifyingGlassIcon className="w-9 h-9 p-2 text-white" />
        </button>
      </form>

      {/* {isFocused && search && (
        <div className="absolute z-10 md:w-[300%] w-full lg:w-full mt-1.5s bg-gray-700 border border-gray-500 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {totalProducts > 0 ? (
            <>
              {products.map((product) => (
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

              {totalProducts > 3 && (
                <Link
                  href={`/search?q=${encodeURIComponent(search)}`}
                  className="block p-4 text-center text-blue-300 hover:bg-gray-800 transition-colors font-medium"
                  onClick={handleNavigation}
                >
                  Ver todas las coincidencias ({total})
                </Link>
              )}
            </>
          ) : (
            <div className="p-4 text-gray-500">
              No se encontraron resultados
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}
