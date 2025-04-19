"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

export default function AdminSearch({ className = "" }) {
  const pathname = usePathname();
  const useParams = useSearchParams();
  const search = useParams.get("search");
  const [valueInput, setValueInput] = useState(search ?? "");
  const { replace } = useRouter();
  const inputRef = useRef(null);

  const params = new URLSearchParams(useParams);

  const handleOnChange = useDebouncedCallback((search) => {
    setValueInput(search);
    if (search) {
      params.set("search", search);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params}`);
  }, 400);

  const handleDeleteSearch = () => {
    inputRef.current.value = "";
    setValueInput("");
    params.set("page", 1);
    params.delete("search");
    replace(`${pathname}?${params}`);
  };

  return (
    <div className="flex items-center relative">
      <div className="relative flex items-center w-[95%] mx-auto">
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
          onChange={(e) => handleOnChange(e.target.value)}
          defaultValue={valueInput}
          className={`pl-9 ${className}`}
        />
        <span className={`absolute left-2 text-white"}`}>
          <MagnifyingGlassIcon
            width={20}
            height={20}
            className="text-gray-400"
          />
        </span>
      </div>

      {valueInput && (
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
