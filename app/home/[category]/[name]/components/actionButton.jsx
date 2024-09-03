"use client";

import { CartContext } from "@/components/(cart)/cartProvider";
import { useContext, useEffect, useState } from "react";

//modificar más adelante para soportar cantidades de producto y no solo 1
//cart, cartProvider, cartContext
export default function ActionButton({ stock, product, typeButton }) {
  const { dispatch, cart } = useContext(CartContext);
  const [label, setLabel] = useState("Cargando");

  const isInCart = cart.items.find((prod) => prod._id === product._id);
  useEffect(() => {
    if (!stock) return setLabel("Sin stock");

    if (isInCart) return setLabel("Quitar del carro");

    setLabel("Añadir al carro");
  }, [stock, isInCart]);

  return (
    <>
      {stock && !isInCart && (
        <button
          onClick={() => {
            dispatch({ type: typeButton, payload: product });
          }}
          // disabled={!stock || isInCart}
          className="z-20 bg-blue-600 text-base hover:bg-blue-800 disabled:bg-gray-400 disabled:text-black disabled:opacity-80 disabled:cursor-not-allowed transition-all text-white px-2 mr-3 py-1 rounded-md shadow-black shadow"
        >
          {label}
        </button>
      )}
      {stock && isInCart && (
        <button
          onClick={() => {
            dispatch({ type: "REMOVE_PRODUCT", payload: product });
          }}
          className="z-20 text-base bg-red-600 text-white opacity-80 transition-all px-2 mr-3 py-1 rounded-md shadow-black shadow"
        >
          {label}
        </button>
      )}
    </>
  );
}
