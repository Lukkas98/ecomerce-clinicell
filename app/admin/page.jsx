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
    <section className="flex min-h-[100dvh] items-center justify-center p-4 pb-[300px]">
      {/* Espacio extra para móvil */}
      <div className="mx-auto w-full max-w-xl rounded-lg border bg-gray-800 p-5 shadow-lg shadow-black">
        <h4 className="text-center text-xl font-semibold text-gray-100 md:text-2xl">
          Panel de Administrador
        </h4>
        <form
          action={formAction}
          className="mt-4 mb-2 flex w-full flex-col gap-4 md:mt-6"
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
              className="mt-2 w-full rounded border-2 border-gray-600 bg-gray-700 px-2 py-2 text-gray-100 focus:border-blue-500 focus:outline-none"
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
              className="mt-2 w-full rounded border-2 border-gray-600 bg-gray-700 px-2 py-2 text-gray-100 focus:border-blue-500 focus:outline-none"
            />
          </label>

          {/* Botón con ID para el scroll */}
          <button
            id="submit-button"
            disabled={isPending}
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
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
