"use client";
import { changeStock } from "@/lib/actions/products";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  timer: 2000,
  position: "top",
  timerProgressBar: true,
  showConfirmButton: false,
});

export default function CheckboxStock({ item }) {
  const handleStockChange = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de cambiar el stock de ${item.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiarlo",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await changeStock(item._id, item.stock);

        if (!response.success) throw new Error(response.message);

        Toast.fire("¡Cambiado!", response.message, "success");
      } catch (error) {
        Toast.fire("¡Ups..!", response.message, "error");
      }
    }
  };

  return (
    <>
      <p className="text-gray-600">{item.stock ? "En stock" : "Sin stock"}</p>
      <input
        type="checkbox"
        checked={item.stock}
        onChange={handleStockChange}
      />
    </>
  );
}
