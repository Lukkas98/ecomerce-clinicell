"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Search from "./search";
import { useDebouncedCallback } from "use-debounce";

export default function InputSearch() {
  const pathname = usePathname();
  const useParams = useSearchParams();
  const { replace } = useRouter();

  const handleOnChange = useDebouncedCallback((search) => {
    const params = new URLSearchParams(useParams);
    if (search) {
      params.set("search", search);
      // params.set("page", "1")
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params}`);
  }, 400);

  return (
    <div className="flex items-center relative mt-2">
      <input
        type="text"
        placeholder="Buscar productos..."
        onChange={(e) => handleOnChange(e.target.value)}
        defaultValue={useParams.get("search")}
        className="rounded-md placeholder:text-black placeholder:text-opacity-80 bg-blue-200 w-fit px-2 py-1 focus:outline-1 focus:outline-slate-900  border-none"
      />
      <div className="absolute -left-7">
        <Search />
      </div>
    </div>
  );
}
