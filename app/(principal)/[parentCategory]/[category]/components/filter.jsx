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
      setTimeout(() => {
        setSelectedOption(currentFilter);
      }, 0);
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
    <div className="mx-auto w-full max-w-sm md:max-w-full">
      {/* Vista móvil: menú desplegable */}
      <div className="relative my-4 block md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded border border-gray-600 bg-gray-800 px-4 py-2 text-left text-base text-gray-100"
        >
          {selectedOption
            ? options.find((option) => option.value === selectedOption).label
            : "Ordenar"}
          <ArrowDownIcon width={20} height={20} className="text-gray-300" />
        </button>
        {isOpen && (
          <ul className="absolute z-10 mt-2 w-full rounded border border-gray-600 bg-gray-700 text-gray-100">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-600"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
        {selectedOption && (
          <button
            onClick={handleClearFilter}
            className="absolute top-1/2 right-4 -translate-y-1/2 transform rounded bg-red-500 p-2 text-white"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        )}
      </div>

      {/* Vista de escritorio: botones horizontales */}
      <div className="my-4 hidden w-full justify-center gap-2 md:flex">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`rounded border border-gray-600 px-4 py-2 ${
              selectedOption === option.value
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {option.label}
          </button>
        ))}
        {selectedOption && (
          <button
            onClick={handleClearFilter}
            className="rounded bg-red-500 p-2 text-white"
          >
            <XMarkIcon width={30} height={30} />
          </button>
        )}
      </div>
    </div>
  );
}
