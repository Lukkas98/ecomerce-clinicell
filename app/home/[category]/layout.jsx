import Header from "@/components/(header)/header";
import DesktopMenu from "@/components/desktopMenu";

export default async function CategoryLayout({ children }) {
  return (
    <main>
      <Header />
      <section className=" lg:grid lg:grid-cols-[18vw,auto]">
        <DesktopMenu />
        {children}
      </section>
    </main>
  );
}
