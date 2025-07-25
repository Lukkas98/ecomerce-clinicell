import { FunnelIcon } from "@heroicons/react/24/outline";

export default function FilterMobileToggle({ filterCount, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden w-full p-3 flex items-center justify-between bg-gray-700 text-white border-b border-gray-600"
    >
      <div className="flex items-center gap-2">
        <FunnelIcon
          className={`h-5 w-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        {filterCount > 0 && (
          <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
            {filterCount}
          </span>
        )}
      </div>
    </button>
  );
}
