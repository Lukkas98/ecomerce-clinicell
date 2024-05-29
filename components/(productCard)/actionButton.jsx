"use client";

import { useContext } from "react";
import { CartContext } from "../(header)/(cart)/cartProvider";

//modificar más adelante para soportar cantidades de producto y no solo 1
//cart, cartProvider, cartContext
export default function ActionButton({ stock, product, typeButton }) {
  const { dispatch, cart } = useContext(CartContext);

  const isInCart = cart.items.find((prod) => prod._id === product._id);
  return (
    <button
      onClick={() => {
        dispatch({ type: typeButton, payload: product });
      }}
      disabled={!stock || isInCart}
      className="z-20 bg-blue-600 hover:bg-blue-800 disabled:bg-gray-400 disabled:text-black disabled:opacity-80 disabled:cursor-not-allowed transition-all text-white text-lg px-2 mr-3 py-1 rounded-md shadow-black shadow"
    >
      {stock
        ? isInCart
          ? "Añadido al Carrito"
          : "Añadir al carro"
        : "Sin stock"}
    </button>
  );
}
