"use client";

import { useActionState } from "react";
import {
  createProductFromForm,
  type CreateProductState,
} from "@/lib/actions/products";

const initialState: CreateProductState = { ok: false, message: "" };

export default function CreateProductForm() {
  const [state, formAction, isPending] = useActionState(
    createProductFromForm,
    initialState,
  );

  return (
    <form action={formAction} className="dashboard-card mt-6 space-y-4 p-5">
      <label className="block">
        <span className="text-sm font-semibold">Nombre</span>
        <input className="form-input" name="name" placeholder="Auriculares de prueba" />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Descripción</span>
        <textarea
          className="form-input min-h-24 resize-y"
          name="description"
          placeholder="Descripción del producto"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-semibold">Precio</span>
          <input className="form-input" min="0" name="price" placeholder="249" step="0.01" type="number" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Stock</span>
          <input className="form-input" min="0" name="stock" placeholder="10" type="number" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Precio de oferta (opcional)</span>
        <input className="form-input" min="0" name="offert" placeholder="199" step="0.01" type="number" />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">URL de imagen (opcional)</span>
        <input className="form-input" name="imageUrl" placeholder="https://..." type="url" />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="outlet" type="checkbox" />
        Producto en outlet
      </label>

      <button
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Guardando..." : "Guardar producto"}
      </button>

      {state.message ? (
        <p className={state.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
