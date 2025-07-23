"use client";

import { CartContext } from "@/components/providers/cartProvider";
import { useContext } from "react";

export default function ActionButton({ product, className = "" }) {
  const { dispatch, cart } = useContext(CartContext);
  const itemInCart = cart.items.find((p) => p._id === product._id);
  const count = itemInCart?.unitsInCart || 0;
  const maxUnits = product.units;

  const handleAdd = () => {
    if (count < maxUnits) {
      dispatch({ type: "ADD_PRODUCT", payload: product });
    }
  };

  const handleRemove = () => {
    if (count > 0) {
      dispatch({ type: "REMOVE_PRODUCT", payload: product });
    }
  };

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <button
        onClick={handleRemove}
        disabled={count <= 0}
        className={`p-1 rounded-md shadow transition-all text-white ${
          count <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-800 hover:bg-red-900"
        }`}
      >
        –
      </button>

      <span className="text-white w-6 text-base text-center">{count}</span>

      <button
        onClick={handleAdd}
        disabled={count >= maxUnits}
        className={`p-1 rounded-md shadow transition-all text-white ${
          count >= maxUnits
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-800 hover:bg-blue-900"
        }`}
      >
        +
      </button>
    </div>
  );
}
