"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function LinkHeader({ categoryName, className = "" }) {
  // const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoryPathname = pathname.split("/")[2];

  return (
    <Link
      className={`${className} whitespace-nowrap px-2 py-1 ${
        decodeURIComponent(categoryPathname) === categoryName
          ? "font-semibold bg-gray-800 border border-gray-200 text-white lg:bg-blue-900 lg:text-teal-50 rounded hover:bg-gray-900 lg:hover:bg-blue-950"
          : ""
      }`}
      href={`/home/${categoryName}?page=1`}
    >
      {categoryName}
    </Link>
  );
}
