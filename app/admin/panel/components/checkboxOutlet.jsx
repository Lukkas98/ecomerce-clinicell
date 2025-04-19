"use client";
import { ChangeOutlet } from "@/lib/actions/products";
import CheckboxToggle from "./checkboxToggle";

export default function CheckboxOutlet({ item }) {
  return (
    <CheckboxToggle
      item={item}
      field="outlet"
      actionFn={ChangeOutlet}
      confirmOptions={{
        title: "¿Estás seguro?",
        getText: (name, curr) =>
          curr
            ? `Estás a punto de sacar ${name} de "Outlet"`
            : `Estás a punto de añadir ${name} a "Outlet"`,
      }}
      onLabel="Outlet"
      offLabel="No Outlet"
      onClass="bg-red-800/80"
      offClass="bg-gray-500/50"
    />
  );
}
