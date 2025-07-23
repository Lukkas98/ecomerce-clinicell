"use client";

import { createContext, useReducer } from "react";

export const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

const carritoReducer = (state, { type, payload }) => {
  switch (type) {
    case "ADD_PRODUCT": {
      const quantityToAdd = payload.quantity ?? 1;
      const existing = state.items.find((prod) => prod._id === payload._id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === payload._id
              ? { ...item, unitsInCart: item.unitsInCart + quantityToAdd }
              : item
          ),
          total: state.total + quantityToAdd,
        };
      }

      // Precio según outlet/discount
      const basePrice = payload.outlet
        ? Math.ceil(payload.price * 0.7)
        : payload.discount
        ? payload.discount
        : payload.price;

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...payload,
            price: basePrice,
            unitsInCart: quantityToAdd,
          },
        ],
        total: state.total + quantityToAdd,
      };
    }

    case "REMOVE_PRODUCT": {
      const existing = state.items.find((prod) => prod._id === payload._id);
      if (!existing) return state;

      // Si hay más de 1, simplemente decrementa
      if (existing.unitsInCart > 1) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === payload._id
              ? { ...item, unitsInCart: item.unitsInCart - 1 }
              : item
          ),
          total: state.total - 1,
        };
      }

      // Si era la última unidad, lo quita completamente
      return {
        ...state,
        items: state.items.filter((item) => item._id !== payload._id),
        total: state.total - 1,
      };
    }

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
