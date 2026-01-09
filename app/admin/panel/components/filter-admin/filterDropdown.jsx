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
    <div className="relative w-full min-w-50 md:flex-1">
      <label className="mb-1 block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => !disableWhile && onToggle()}
          disabled={disableWhile}
          className={`flex w-full items-center justify-between rounded-lg border px-4 py-2 text-left ${
            disableWhile
              ? "cursor-not-allowed border-gray-700 bg-gray-900 text-gray-500"
              : "border-gray-600 bg-gray-700 text-gray-200"
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
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-600 bg-gray-700 shadow-lg">
            {options.map((option) => {
              const isNoneOption = option.value === "";
              const disabledOption = isNoneOption && !allowNone;
              return (
                <li
                  key={`${filterType}-${option.value}`}
                  onClick={() =>
                    !disabledOption && onSelect(filterType, option.value)
                  }
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-600 ${
                    selectedValue === option.value ? "bg-gray-600" : ""
                  } ${
                    disabledOption ? "cursor-not-allowed text-gray-500" : ""
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
