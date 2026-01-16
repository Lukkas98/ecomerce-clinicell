"use client";

import { CartContext } from "@/components/providers/cartProvider";
import { useContext } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function ActionButton({ product, className }) {
  const { dispatch, cart } = useContext(CartContext);
  const itemInCart = cart.items.find((p) => p._id === product._id);
  const inCart = itemInCart?.unitsInCart || 0;
  const maxUnits = product.units;

  const handleAdd = () => {
    if (inCart < maxUnits) {
      dispatch({ type: "ADD_PRODUCT", payload: product });
    }
  };

  const handleRemove = () => {
    if (inCart > 0) {
      dispatch({ type: "REMOVE_PRODUCT", payload: product });
    }
  };

  return (
    <div
      className={`flex min-h-10 min-w-[45%] items-center justify-around gap-1 ${className}`}
    >
      <button
        className="flex aspect-square w-[33%] items-center justify-center rounded-lg bg-linear-to-br from-red-700 to-gray-800 text-white shadow-md transition-all duration-200 hover:from-gray-600 hover:to-gray-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
        disabled={inCart <= 0}
        onClick={handleRemove}
      >
        <FiMinus className="h-2.5 w-2.5 lg:h-5 lg:w-5" />
      </button>

      <span className="flex aspect-square w-[33%] items-center justify-center text-xs font-bold text-white">
        {inCart}
      </span>

      <button
        className="flex aspect-square w-[33%] items-center justify-center rounded-lg bg-linear-to-br from-green-800 to-gray-800 text-white shadow-md transition-all duration-200 hover:from-green-600 hover:to-gray-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={product.stock <= 0 || inCart >= maxUnits}
        onClick={handleAdd}
      >
        <FiPlus className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}
