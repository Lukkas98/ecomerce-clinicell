"use client";

import Link from "next/link";

const { useSearchParams } = require("next/navigation");

export default function LinkHeader({categoryName}) {
  const searchParams = useSearchParams();

  return (
    <Link
      className="border px-2 py-1 border-blue-800 rounded-md hover:bg-blue-950 transition-all"
      href={`/home/${categoryName}?${searchParams.toString()}`}
    >
      {categoryName}
    </Link>
  );
}
