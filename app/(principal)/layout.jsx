import Header from "@/components/(header)/header";
import FooterComponent from "./home/components/fotter";

export default function CategoryLayout({ children }) {
  return (
    <main
      className="bg-gray-900 relative text-gray-100 h-dvh flex flex-col
     justify-between w-[100svw] mx-auto lg:grid lg:grid-cols-1 lg:grid-rows-[auto_1fr_auto] lg:gap-4"
    >
      <Header />

      <div className="max-w-dvw 2xl:max-w-[2000px] 2xl:mx-auto p-4 mt-24">
        {children}
      </div>

      <FooterComponent />
    </main>
  );
}
