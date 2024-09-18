"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Filter() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const options = [
    { label: "A-Z", value: "az" },
    { label: "Z-A", value: "za" },
    { label: "Precios: Mayor a Menor", value: "high-to-low" },
    { label: "Precios: Menor a Mayor", value: "low-to-high" },
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
    <div className="w-full max-w-sm mx-auto md:max-w-full">
      {/* Vista móvil: menú desplegable */}
      <div className="relative block md:hidden my-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border rounded bg-gray-300 text-left text-base flex justify-between items-center"
        >
          {selectedOption
            ? options.find((option) => option.value === selectedOption).label
            : "Filtros"}
          <ArrowDownIcon width={20} height={20} />
        </button>
        {isOpen && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-2">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
        {selectedOption && (
          <button
            onClick={handleClearFilter}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        )}
      </div>

      {/* Vista de escritorio: botones horizontales */}
      <div className="hidden md:flex justify-center gap-2 w-full my-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`px-4 py-2 border rounded ${
              selectedOption === option.value
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
        {selectedOption && (
          <button
            onClick={handleClearFilter}
            className="bg-red-500 text-white p-2 rounded"
          >
            <XMarkIcon width={30} height={30} />
          </button>
        )}
      </div>
    </div>
  );
}
