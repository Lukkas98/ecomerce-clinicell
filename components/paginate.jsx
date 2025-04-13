"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Paginate({ totalPages = 1 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const renderButton = (
    content,
    page,
    isActive = false,
    isDisabled = false
  ) => (
    <button
      key={`${content}-${page}`}
      onClick={() => !isDisabled && handlePageChange(page)}
      className={`min-w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-all
        ${isActive ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"}
        ${isDisabled ? "opacity-20 pointer-events-none" : "cursor-pointer"}
        mx-0.5`}
      disabled={isDisabled}
    >
      {content}
    </button>
  );

  const renderJumpButton = (direction) => {
    const jump = direction === "prev" ? -5 : 5;
    const targetPage = currentPage + jump;
    const isDisabled =
      direction === "prev" ? currentPage <= 1 : currentPage >= totalPages;

    return renderButton(
      direction === "prev" ? "-5" : "+5",
      Math.max(1, Math.min(totalPages, targetPage)),
      false,
      isDisabled
    );
  };

  return (
    totalPages > 1 && (
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex gap-1 justify-center min-w-max px-4">
          {/* Botón Anterior */}
          {renderButton(
            <ChevronLeftIcon className="w-5 h-5" />,
            currentPage - 1,
            false,
            currentPage === 1
          )}

          {/* Botón -5 */}
          {currentPage > 3 && renderJumpButton("prev")}

          {/* Primera página si no está cerca */}
          {currentPage > 3 && renderButton(1, 1)}

          {/* Página actual */}
          {renderButton(currentPage, currentPage, true)}

          {/* Última página si no está cerca */}
          {currentPage < totalPages - 2 && renderButton(totalPages, totalPages)}

          {/* Botón +5 */}
          {currentPage < totalPages - 2 && renderJumpButton("next")}

          {/* Botón Siguiente */}
          {renderButton(
            <ChevronRightIcon className="w-5 h-5" />,
            currentPage + 1,
            false,
            currentPage === totalPages
          )}
        </div>
      </div>
    )
  );
}
