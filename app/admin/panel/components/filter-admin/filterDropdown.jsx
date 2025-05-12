import { ArrowDownIcon } from "@heroicons/react/24/outline";

export default function FilterDropdown({
  filterType,
  label,
  options,
  selectedValue,
  onSelect,
  disableWhile = false,
  allowNone,
  isOpen,
  onToggle,
}) {
  return (
    <div className="relative w-full md:flex-1 min-w-[200px]">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => !disableWhile && onToggle()}
          disabled={disableWhile}
          className={`w-full px-4 py-2 border rounded-lg text-left flex justify-between items-center ${
            disableWhile
              ? "bg-gray-900 text-gray-500 border-gray-700 cursor-not-allowed"
              : "bg-gray-700 text-gray-200 border-gray-600"
          }`}
        >
          {selectedValue
            ? options.find((o) => o.value === selectedValue)?.label
            : "Todos"}
          <ArrowDownIcon
            className={`ml-2 ${
              disableWhile ? "text-gray-600" : "text-gray-400"
            }`}
            width={16}
            height={16}
          />
        </button>
        {isOpen && !disableWhile && (
          <ul className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
            {options.map((option) => {
              const isNoneOption = option.value === "";
              const disabledOption = isNoneOption && !allowNone;
              return (
                <li
                  key={`${filterType}-${option.value}`}
                  onClick={() =>
                    !disabledOption && onSelect(filterType, option.value)
                  }
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-600 ${
                    selectedValue === option.value ? "bg-gray-600" : ""
                  } ${
                    disabledOption ? "text-gray-500 cursor-not-allowed" : ""
                  }`}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
