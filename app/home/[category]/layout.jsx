import InputSearch from "@/components/(header)/(search)/inputSearch";
import Header from "@/components/(header)/header";
import DesktopMenu from "@/components/desktopMenu";

export default async function CategoryLayout({ children }) {
  return (
    <main className="min-h-screen relative grid">
      <Header />
      <section className="lg:grid grid-cols-[0.2fr,1fr]">
        <DesktopMenu />
        {children}
      </section>
      <div className="sticky max-h-14 h-full bottom-0 py-3 w-full flex justify-center items-center bg-teal-50 border-t border-black z-30">
        <InputSearch />
      </div>
    </main>
  );
}
