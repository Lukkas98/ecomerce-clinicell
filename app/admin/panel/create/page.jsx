import { getCategories } from "@/lib/actions";
import FromCreate from "./formCreate";
import Link from "next/link";

export default async function CreateProduct() {
  const categories = await getCategories();

  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-white m-5">
      <Link href={"/admin/panel"} >Volver al panel</Link>
      <h2 className="text-lg font-semibold mb-4">Subir Producto</h2>
      <FromCreate categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
