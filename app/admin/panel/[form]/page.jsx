import { getCategories, getCategoryId } from "@/lib/actions/categories";
import Link from "next/link";
import { getProduct } from "@/lib/actions/products";
import Form from "./components/form";

export default async function FormPage({ params, searchParams }) {
  const categories = await getCategories(true);
  const { form } = params;
  const { id } = searchParams;

  let productEdit = {};
  if (form === "edit") {
    const product = await getProduct(id);
    productEdit = product.toObject(); // Convertir a objeto plano

    // Obtener el nombre de la categoría en lugar del ID
    const category = await getCategoryId(product.category);
    const categoryPlane = category.toObject();
    productEdit.category = categoryPlane.name; // Reemplazar el ID por el nombre de la categoría
  }

  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-white m-5 max-w-5xl mx-3 lg:mx-auto">
      <Link
        className="px-2 py-1 bg-red-400 text-sm rounded text-white font-semibold hover:bg-red-600 transition-all"
        href={"/admin/panel"}
      >
        Volver
      </Link>
      <h2 className="text-lg font-semibold my-4 text-center">
        {form === "edit" ? "Actualizar Producto" : "Subir Producto"}
      </h2>
      <Form
        categories={categories}
        mode={form}
        initialData={JSON.parse(JSON.stringify(productEdit))}
      />
    </div>
  );
}
