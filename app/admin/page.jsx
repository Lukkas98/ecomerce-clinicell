"use client";
import { logAdmin } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function LoginAdmin() {
  const [state, formAction, isPending] = useActionState(logAdmin, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.href) router.replace(state.href);
  }, [state?.href, router]);

  return (
    <section className="min-h-[100dvh] flex items-center justify-center p-4 pb-[300px]">
      {" "}
      {/* Espacio extra para móvil */}
      <div className="border p-5 bg-gray-800 rounded-lg shadow-lg shadow-black w-full max-w-xl mx-auto">
        <h4 className="text-xl md:text-2xl text-center font-semibold text-gray-100">
          Panel de Administrador
        </h4>
        <form
          action={formAction}
          className="mt-4 md:mt-6 mb-2 w-full flex flex-col gap-4"
        >
          {/* Input Email con auto-scroll */}
          <label className="w-full">
            <span className="text-gray-200">Email</span>
            <input
              name="user"
              type="email"
              required
              onFocus={(e) => {
                setTimeout(() => {
                  document.getElementById("submit-button")?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }, 300);
              }}
              className="w-full border-2 border-gray-600 bg-gray-700 text-gray-100 rounded px-2 py-2 mt-2 focus:outline-none focus:border-blue-500"
            />
          </label>

          {/* Input Contraseña con auto-scroll */}
          <label className="w-full">
            <span className="text-gray-200">Contraseña</span>
            <input
              name="pass"
              type="password"
              required
              onFocus={(e) => {
                setTimeout(() => {
                  document.getElementById("submit-button")?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }, 300);
              }}
              className="w-full border-2 border-gray-600 bg-gray-700 text-gray-100 rounded px-2 py-2 mt-2 focus:outline-none focus:border-blue-500"
            />
          </label>

          {/* Botón con ID para el scroll */}
          <button
            id="submit-button"
            disabled={isPending}
            type="submit"
            className="mt-6 px-4 py-2 w-full bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isPending ? "Verificando..." : "Entrar"}
          </button>

          {state?.message && (
            <div className="mt-2 text-center text-white">{state.message}</div>
          )}
        </form>
      </div>
    </section>
  );
}
