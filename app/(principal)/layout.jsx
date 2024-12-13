import Header from "@/components/(header)/header";

export default async function CategoryLayout({ children }) {
  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen flex flex-col justify-between lg:justify-stretch w-screen min-w-[100vw] lg:grid max-w-[2000px] mx-auto overflow-x-hidden">
      <Header />
      <div>{children}</div>
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