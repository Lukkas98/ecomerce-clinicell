"use client";

import { useRouter } from "next/navigation";

export default function BtnBack() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="mb-4 cursor-pointer rounded-md bg-blue-700 px-2 py-1 text-gray-200 hover:text-gray-300 focus:outline-none"
      data-cart-prev
      onClick={() => router.back()}
    >
      Volver
    </button>
  );
}
