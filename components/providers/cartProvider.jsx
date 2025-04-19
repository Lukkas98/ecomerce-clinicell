"use client";

import { createContext, useReducer } from "react";

export const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

const carritoReducer = (state, { type, payload }) => {
  switch (type) {
    case "ADD_PRODUCT":
      const produtToAdd = state.items.find((prod) => prod._id === payload._id);
      if (produtToAdd) return state;

      // Si el producto es "outlet", aplicamos un descuento del 30%
      const discountPrice = payload.outlet
        ? Math.ceil(payload.price * 0.7)
        : payload.discount ?? payload.price;

      return {
        ...state,
        items: [...state.items, { ...payload, price: discountPrice }],
        total: state.total + 1,
      };

    case "REMOVE_PRODUCT":
      const prodToRemove = state.items.filter((obj) => obj._id !== payload._id);
      return { ...state, items: prodToRemove, total: state.total - 1 };
    case "EMPTY_CART":
      return initialState;
    default:
      return state;
  }
};

export default function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(carritoReducer, initialState);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
