"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function InputSearch({ isAdmin = false }) {
  const pathname = usePathname();
  const useParams = useSearchParams();
  const { replace } = useRouter();

  const params = new URLSearchParams(useParams);

  const handleOnChange = useDebouncedCallback((search) => {
    if (search) {
      params.set("search", search);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params}`);
  }, 400);

  const handleDeleteSearch = () => {
    params.set("page", 1);
    params.delete("search");
    replace(`${pathname}?${params}`);
  };

  return (
    <div className={`relative max-w-lg ${isAdmin ? "w-full" : "w-[60%]"}`}>
      <div className="flex items-center w-full">
        <input
          type="text"
          placeholder="Buscar productos..."
          onChange={(e) => handleOnChange(e.target.value)}
          defaultValue={useParams.get("search")}
          className={
            isAdmin
              ? "bg-gray-700 text-white rounded-lg w-full p-2 outline-none"
              : "flex-grow px-4 py-2 rounded-md border-2 border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          }
        />
        <div
          className={`absolute ${isAdmin ? "hidden" : "-left-8 text-white"}`}
        >
          <MagnifyingGlassIcon
            width={30}
            height={30}
            className="text-gray-400"
          />
        </div>
        {params.get("search") && (
          <button
            onClick={handleDeleteSearch}
            className="absolute right-2 p-1 bg-red-600 text-white rounded-lg"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        )}
      </div>
    </div>
  );
}
