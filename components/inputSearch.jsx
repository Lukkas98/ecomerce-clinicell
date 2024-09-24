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
    <div className="flex items-center w-[90%] relative max-w-lg">
      <div className="relative flex items-center justify-center w-full">
        <input
          type="text"
          placeholder="Buscar productos..."
          onChange={(e) => handleOnChange(e.target.value)}
          defaultValue={useParams.get("search") ?? ""}
          className={`pl-10
            ${
              isAdmin
                ? "bg-gray-700 text-white rounded-lg w-full p-2 outline-none"
                : "py-2 rounded-md border-2 w-full border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            }`}
        />
        <span className={`absolute left-2 text-white"}`}>
          <MagnifyingGlassIcon
            width={30}
            height={30}
            className="text-gray-400"
          />
        </span>
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
  );
}
