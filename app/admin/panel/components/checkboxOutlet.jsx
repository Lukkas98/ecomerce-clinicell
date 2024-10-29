"use client";
import { ChangeOutlet } from "@/lib/actions/products";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  timer: 2000,
  position: "top",
  timerProgressBar: true,
  showConfirmButton: false,
  background: "#374151",
  color: "#E5E7EB",
});

export default function CheckboxOutlet({ item }) {
  const handleOutletChange = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: item.outlet
        ? `Estás a punto de sacar ${item.name} de "Outlet"`
        : `Estás a punto de añadir ${item.name} a "Outlet"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiarlo",
      cancelButtonText: "Cancelar",
      background: "#374151",
      color: "#E5E7EB",
    });

    if (result.isConfirmed) {
      try {
        const response = await ChangeOutlet(item._id, item.outlet);

        if (!response.success) throw new Error(response.message);

        Toast.fire("¡Cambiado!", response.message, "success");
      } catch (error) {
        Toast.fire("¡Ups..!", response.message, "error");
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-center text-white gap-3 px-2 py-0.5 col-span-2 h-fit rounded-md whitespace-nowrap ${
        item.outlet ? "bg-red-800" : "bg-green-800"
      }`}
    >
      <p className="">{item.outlet ? "Outlet" : "No Outlet"}</p>
      <input
        type="checkbox"
        checked={item.outlet}
        onChange={handleOutletChange}
        className="inline-block"
      />
    </div>
  );
}
