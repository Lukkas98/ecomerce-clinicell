"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AdminFilter() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // actualizar filtros para buscar tambien por discount
  const options = [
    { label: "Con stock", value: "stock" },
    { label: "Sin stock", value: "-stock" },
  ];

  useEffect(() => {
    const currentFilter = searchParams.get("filter");
    if (currentFilter) {
      setSelectedOption(currentFilter);
    }
  }, [searchParams]);

  const handleSelect = (value) => {
    setSelectedOption(value);
    setIsOpen(false);

    const params = new URLSearchParams(searchParams);
    params.set("filter", value);
    params.set("page", 1);

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilter = () => {
    setSelectedOption("");
    const params = new URLSearchParams(searchParams);
    params.delete("filter");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative block my-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border rounded-lg bg-gray-800 text-gray-200 text-left text-base flex justify-between items-center"
        >
          {selectedOption
            ? options.find((option) => option.value === selectedOption).label
            : "Filtrar por stock"}
          <ArrowDownIcon className="text-gray-400" width={20} height={20} />
        </button>
        {isOpen && (
          <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-lg mt-2 text-white">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-600"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
        {selectedOption && (
          <button
            onClick={handleClearFilter}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-lg"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        )}
      </div>
    </div>
  );
}
