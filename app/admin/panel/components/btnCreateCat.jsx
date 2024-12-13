"use client";
import { useActionState, useEffect, useState } from "react";
import { createCategory } from "@/lib/actions/categories";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  timer: 1800,
  timerProgressBar: true,
  showConfirmButton: false,
  background: "#374151",
  color: "#E5E7EB",
});

export default function BtnCreateCategory({ categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isParent, setIsParent] = useState(true);
  const [parentCategory, setParentCategory] = useState("");

  const [state, formAction, isPending] = useActionState(createCategory, null);

  const closeModal = () => {
    setIsOpen(false);
    setIsParent(true);
    setParentCategory("");
  };

  useEffect(() => {
    const success = state?.success;

    Toast.fire({
      icon: success ? "success" : "error",
      title: success ? "Creada" : "Error",
      text: state?.message,
      didClose: () => {
        closeModal();
      },
    });
  }, [state?.message, state?.success]);

  return (
    <>
      <div
        className="px-4 py-3 bg-gray-800 max-w-xl w-[90%] mx-5 md:mx-auto bg-opacity-75 rounded-lg border-2 border-dashed border-gray-600
               hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all flex items-center justify-center md:col-span-2 lg:col-span-3"
      >
        {/* Botón para abrir el modal */}
        <button onClick={() => setIsOpen(true)}>Crear Categoría</button>
      </div>

      {/* Modal */}
      {isOpen && (
        <>
          <div
            onClick={closeModal}
            className="fixed top-0 left-0 bg-black bg-opacity-55 w-full h-full z-40"
          ></div>
          <form
            action={formAction}
            className="fixed  bg-black bg-opacity-70 flex items-center justify-center z-50"
          >
            <div className="bg-gray-800 text-white rounded-lg p-6 w-96 space-y-4">
              <h2 className="text-lg font-bold">Nueva Categoría</h2>
              <input
                autoComplete="off"
                type="text"
                name="name"
                placeholder={
                  isParent
                    ? "Nombre Categoría Principal"
                    : "Nombre de Sub-Categoría"
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    name="isParent"
                    type="checkbox"
                    checked={isParent}
                    onChange={() => setIsParent(!isParent)}
                    className="form-checkbox text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span>Es categoría principal</span>
                </label>

                {!isParent && (
                  <select
                    name="parentCategory"
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  >
                    <option disabled value="">
                      Selecciona categoría principal
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                {isPending ? (
                  <div className="mt-2 text-center text-white">
                    Procesando, por favor espere...
                  </div>
                ) : (
                  <>
                    <div
                      onClick={closeModal}
                      className="px-4 py-2 inline-block bg-gray-600 rounded-md hover:bg-gray-700"
                    >
                      Cancelar
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Crear
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}
