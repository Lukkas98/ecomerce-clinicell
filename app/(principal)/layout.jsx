import Header from "@/components/(header)/header";
import FooterComponent from "./home/components/fotter";

export default function CategoryLayout({ children }) {
  return (
    <main className="relative mx-auto flex h-dvh w-svw flex-col justify-between bg-gray-900 text-gray-100 lg:grid lg:grid-cols-1 lg:grid-rows-[auto_1fr_auto] lg:gap-4">
      <Header />

      <div className="mt-24 max-w-dvw p-4 2xl:mx-auto 2xl:max-w-500">
        {children}
      </div>

      <FooterComponent />
    </main>
  );
}
