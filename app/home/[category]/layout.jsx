import Header from "@/components/(header)/header";
import DesktopNav from "./components/desktopNav";

export default async function CategoryLayout({ children }) {
  return (
    <main className="bg-gray-900 text-gray-100 min-h-screen w-screen min-w-[100vw] md:grid max-w-[2000px] mx-auto">
      <Header />
      <div className="lg:grid grid-cols-[0.4fr,1fr] xl:grid-cols-[350px,auto]">
        <div className="hidden lg:block max-w-[350px]">
          <DesktopNav />
        </div>
        {children}
      </div>
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
