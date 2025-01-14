import Header from "@/components/(header)/header";
import { Suspense } from "react";

export default async function CategoryLayout({ children }) {
  return (
    <main className="bg-gray-900 relative text-gray-100 min-h-[100svh] flex flex-col justify-between lg:justify-stretch w-[100svw] min-w-full lg:grid max-w-[2000px] mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>

      <div className="max-w-full mx-auto p-4">{children}</div>

      <footer className="bg-slate-800 text-white w-full text-center pb-2 pt-5 flex items-center justify-center">
        <p>
          Clinic-Cell © {new Date().getFullYear()} | Desarrollado por{" "}
          <a
            href="mailto:lucaspalma988@gmail.com?subject=Consulta sobre Clinic-Cell&body=Hola, me gustaría recibir más información sobre..."
            className="text-blue-400"
            title="Click para enviarme un mail"
            target="_blank"
          >
            Lucas
          </a>
        </p>
      </footer>
    </main>
  );
}
