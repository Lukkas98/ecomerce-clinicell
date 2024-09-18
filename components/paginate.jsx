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

  const renderButtons = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) endPage = Math.min(5, totalPages);
    if (currentPage > totalPages - 3) startPage = Math.max(1, totalPages - 4);

    const buttons = [];
    if (startPage > 1) buttons.push(renderNavButton("Inicio", 1));
    if (startPage > 2) buttons.push(renderJumpButton("prev", currentPage - 5));
    for (let page = startPage; page <= endPage; page++)
      buttons.push(renderButton(page));
    if (endPage < totalPages - 1)
      buttons.push(renderJumpButton("next", currentPage + 5));
    if (endPage < totalPages)
      buttons.push(renderNavButton("Final", totalPages));

    return buttons;
  };

  const renderButton = (page) => (
    <button
      key={page}
      onClick={() => handlePageClick(page)}
      className={`px-3 py-2 ${
        page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
      } rounded-md shadow-md`}
    >
      {page}
    </button>
  );

  const renderNavButton = (label, page) => (
    <button
      key={label}
      onClick={() => handlePageClick(page)}
      className="px-3 py-2 bg-gray-200 rounded-md shadow-md"
    >
      {label}
    </button>
  );

  const renderJumpButton = (type, page) => (
    <button
      key={type}
      onClick={() => handlePageClick(Math.max(1, Math.min(totalPages, page)))}
      className="px-3 py-2 bg-gray-200 rounded-md shadow-md"
    >
      {type === "prev" ? "-5" : "+5"}
    </button>
  );

  return (
    totalPages > 1 && (
      <div className="flex gap-2 self-center my-4 flex-wrap justify-center mx-4">
        {renderButtons()}
      </div>
    )
  );
}
