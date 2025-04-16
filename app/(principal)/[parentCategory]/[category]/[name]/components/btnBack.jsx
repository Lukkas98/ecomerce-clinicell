"use client";

import { useRouter } from "next/navigation";

export default function BtnBack() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="cursor-pointer mb-4 focus:outline-none px-2 py-1 bg-blue-700 rounded-md text-gray-200 hover:text-gray-300"
      data-cart-prev
      onClick={() => router.back()}
    >
      Volver
    </button>
  );
}
