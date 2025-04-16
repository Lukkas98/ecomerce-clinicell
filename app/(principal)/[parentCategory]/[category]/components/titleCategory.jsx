"use client";
import { usePathname } from "next/navigation";

export default function TitleCategory() {
  const pathname = usePathname();
  const title = pathname.split("/")[2];

  return (
    <h2 className="text-xl font-semibold">
      {title === "Todos" ? "Todos los Productos" : decodeURIComponent(title)}
    </h2>
  );
}
