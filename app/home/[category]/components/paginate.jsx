"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function Paginate({ totalPages = 1 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageClick = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    totalPages > 1 && (
      <div className="flex gap-2 self-center my-4">
        {/* Renderiza los botones de página */}
        {[...Array(totalPages).keys()].map((index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-2 ${
                page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
              } rounded-md shadow-black shadow`}
            >
              {page}
            </button>
          );
        })}
      </div>
    )
  );
}
