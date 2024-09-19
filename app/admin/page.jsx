"use client";

import { logAdmin } from "@/lib/actions";
import { useState, useTransition } from "react";
import Swal from "sweetalert2";

export default function LoginAdmin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, startTransition] = useTransition(false);

  const handleOnSubmit = async (e) => {
    try {
      startTransition(
        await logAdmin(e),
        Swal.fire({
          title: "Bienvenido",
          text: "Entrando al panel",
          icon: "success",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
          position: "top",
        })
      );
    } catch (error) {
      Swal.fire({
        title: "Ocurrio un error",
        text: error.message,
        icon: "error",
        position: "top",
      });
    }
  };

  return (
    <section className="flex justify-center items-center mt-10">
      <div className="border p-5 bg-gray-800 rounded-lg shadow-lg shadow-black w-[90%] max-w-xl mx-auto">
        <h4 className="text-2xl text-center font-semibold text-gray-100">
          Panel de Administrador
        </h4>
        <form
          action={handleOnSubmit}
          className="mt-8 mb-2 w-full flex flex-col gap-4"
        >
          <label className="w-full">
            <span className="text-gray-200">Email</span>
            <input
              onChange={(e) => setUser(e.target.value)}
              name="user"
              type="text"
              placeholder="admin user"
              className="w-full border-2 border-gray-600 bg-gray-700 text-gray-100 rounded px-2 py-2 mt-2 focus:outline-none focus:border-blue-500 transition-all"
            />
          </label>
          <label className="w-full">
            <span className="text-gray-200">Contraseña</span>
            <input
              onChange={(e) => setPass(e.target.value)}
              name="pass"
              type="password"
              placeholder="********"
              className="w-full border-2 border-gray-600 bg-gray-700 text-gray-100 rounded px-2 py-2 mt-2 focus:outline-none focus:border-blue-500 transition-all"
            />
          </label>

          {pass && user && (
            <button
              type="submit"
              className="mt-6 px-4 py-2 w-full bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
