import Header from "@/components/(header)/header";
import FooterComponent from "./home/components/fotter";

export default function CategoryLayout({ children }) {
  return (
    <main className="bg-gray-900 relative text-gray-100 min-h-[100svh] flex flex-col justify-between lg:justify-stretch w-[100svw] min-w-full lg:grid max-w-[2000px] mx-auto">
      <Header />

      <div className="max-w-full p-4">{children}</div>

      <FooterComponent />
    </main>
  );
}
