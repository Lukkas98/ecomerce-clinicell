import Header from "@/components/(header)/header";

export default function CategoryLayout({ children }) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
