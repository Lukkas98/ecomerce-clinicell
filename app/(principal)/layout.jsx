import Header from "@/components/(header)/header";
import { Suspense } from "react";
import FooterComponent from "./home/components/fotter";

export default async function CategoryLayout({ children }) {
  return (
    <main className="bg-gray-900 relative text-gray-100 min-h-[100svh] flex flex-col justify-between lg:justify-stretch w-[100svw] min-w-full lg:grid max-w-[2000px] mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>

      <div className="max-w-full mx-auto p-4">{children}</div>

      <FooterComponent />
    </main>
  );
}
