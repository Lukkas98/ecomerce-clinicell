import { FunnelIcon } from "@heroicons/react/24/outline";

export default function FilterMobileToggle({ filterCount, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between border-b border-gray-600 bg-gray-700 p-3 text-white md:hidden"
    >
      <div className="flex items-center gap-2">
        <FunnelIcon
          className={`h-5 w-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        {filterCount > 0 && (
          <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
            {filterCount}
          </span>
        )}
      </div>
    </button>
  );
}
