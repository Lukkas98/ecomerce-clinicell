import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function FilterActions({
  hasFilters,
  applyFilters,
  clearFilters,
}) {
  return (
    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 mt-2">
      <button
        onClick={applyFilters}
        disabled={!hasFilters}
        className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
          hasFilters
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        <FunnelIcon width={16} height={16} />
        <span>Aplicar filtros</span>
      </button>
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
        >
          <XMarkIcon width={16} height={16} />
          <span>Quitar filtros</span>
        </button>
      )}
    </div>
  );
}
