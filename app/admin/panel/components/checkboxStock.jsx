// components/CheckboxStock.jsx
"use client";
import { changeStock } from "@/lib/actions/products";
import CheckboxToggle from "./checkboxToggle";

export default function CheckboxStock({ item }) {
  return (
    <CheckboxToggle
      item={item}
      field="stock"
      actionFn={changeStock}
      confirmOptions={{
        title: "¿Estás seguro?",
        getText: (name) => `Estás a punto de cambiar el stock de ${name}`,
      }}
      onLabel="En stock"
      offLabel="Sin stock"
      onClass="bg-green-800"
      offClass="bg-red-800"
    />
  );
}
