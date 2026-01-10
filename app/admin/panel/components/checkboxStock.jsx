"use client";

import { changeUnits } from "@/lib/actions/products";
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

export default function CheckboxStock({ item }) {
  const handleDiscount = async () => {
    const { value: newUnits } = await Swal.fire({
      title: `unidades de ${item.name}`,
      input: "number",
      inputLabel: "Unidades en stock",
      inputValue: item.units,
      showCancelButton: true,
      background: "#374151",
      color: "#E5E7EB",
    });
    if (!newUnits) return;

    try {
      if (Number(newUnits) < 0) {
        Toast.fire({
          icon: "error",
          title: "no puede haber unidades negativas",
        });
        return;
      }

      const res = await changeUnits(item._id, Number(newUnits));
      if (!res.success) throw new Error(res.message);
      Toast.fire({ icon: "success", title: res.message });
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.message || "Error desconocido",
      });
    }
  };

  return (
    <div
      className={`flex h-fit items-center justify-center gap-3 rounded-md px-2 py-1 text-white ${
        item.units ? "bg-green-800/50" : "bg-red-500/50"
      }`}
    >
      <p className="whitespace-nowrap">Stock</p>
      <input
        type="checkbox"
        checked={!!item.units}
        onChange={handleDiscount}
        className="inline-block"
      />
    </div>
  );
}

// "use client";
// import { changeStock } from "@/lib/actions/products";
// import CheckboxToggle from "./checkboxToggle";

// export default function CheckboxStock({ item }) {
//   return (
//     <CheckboxToggle
//       item={item}
//       field="stock"
//       actionFn={changeStock}
//       confirmOptions={{
//         title: "¿Estás seguro?",
//         getText: (name) => `Estás a punto de cambiar el stock de ${name}`,
//       }}
//       onLabel="En stock"
//       offLabel="Sin stock"
//       onClass="bg-green-800"
//       offClass="bg-red-800"
//     />
//   );
// }
