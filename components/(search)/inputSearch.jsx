"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Search from "./search";
import { useDebouncedCallback } from "use-debounce";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
              : "rounded-md w-full placeholder:text-black placeholder:text-opacity-80 bg-blue-200 px-2 py-1 focus:outline-1 focus:outline-slate-900 border-none mr-2"
          }
        />
        <div
          className={`absolute ${isAdmin ? "hidden" : "-left-10 text-white"}`}
        >
          <Search />
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
