import DesktopMenu from "./components/desktopMenu";
import InputSearch from "./components/(search)/inputSearch";
import Header from "@/components/(header)/header";

export default async function CategoryLayout({ children }) {
  return (
    <main className="min-h-screen relative grid">
      <Header />
      <section className="lg:grid grid-cols-[300px,1fr]">
        <DesktopMenu />
        {children}
      </section>
      <div className="sticky bg-slate-800 max-h-20 bottom-0 py-5 w-full flex justify-center items-center border-t border-black z-30">
        <InputSearch />
      </div>
      <footer className="bg-slate-800 text-white w-full text-center pb-2 pt-5">
        Clinic-Cell © {new Date().getFullYear()} | Desarrollado por{" "}
        <a
          href="mailto:tuemail@gmail.com?subject=Consulta sobre Clinic-Cell&body=Hola, me gustaría recibir más información sobre..."
          className="text-blue-400"
          title="Click para enviarme un mail"
        >
          Lucas
        </a>
      </footer>
    </main>
  );
}
