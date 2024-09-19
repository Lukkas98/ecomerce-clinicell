import Header from "@/components/(header)/header";

export default function ClientPage({ children }) {
  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen">
      <Header /> {/* listo */}
      {children} {/* categorias */}
      <footer className="bg-slate-800 text-white w-full text-center pb-2 pt-5">
        Clinic-Cell © {new Date().getFullYear()} | Desarrollado por{" "}
        <a
          href="mailto:lucaspalma988@gmail.com?subject=Consulta sobre Clinic-Cell&body=Hola, me gustaría recibir más información sobre..."
          className="text-blue-400"
          title="Click para enviarme un mail"
        >
          Lucas
        </a>
      </footer>
    </main>
  );
}
