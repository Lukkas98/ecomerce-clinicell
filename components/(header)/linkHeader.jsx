"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function LinkHeader({ categoryName, className = "" }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <Link
      className={`${className} ${
        pathname.split("/")[2] === categoryName
          ? "font-semibold bg-teal-50 text-blue-700 lg:bg-blue-700 lg:text-teal-50 rounded hover:bg-teal-100 lg:hover:bg-blue-500"
          : ""
      }`}
      href={`/home/${categoryName}`}
    >
      {categoryName}
    </Link>
  );
}
