import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function FilterActions({
  hasFilters,
  applyFilters,
  clearFilters,
}) {
  return (
    <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row md:w-auto">
      <button
        onClick={applyFilters}
        disabled={!hasFilters}
        className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 ${
          hasFilters
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "cursor-not-allowed bg-gray-700 text-gray-400"
        }`}
      >
        <FunnelIcon width={16} height={16} />
        <span>Aplicar filtros</span>
      </button>
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          <XMarkIcon width={16} height={16} />
          <span>Quitar filtros</span>
        </button>
      )}
    </div>
  );
}
