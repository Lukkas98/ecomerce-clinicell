"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function LinkHeader({ categoryName, className = "" }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <Link
      className={`${className} ${
        pathname.split("/")[2] === categoryName ? "font-semibold" : ""
      }`}
      href={`/home/${categoryName}`}
    >
      {categoryName}
    </Link>
  );
}
