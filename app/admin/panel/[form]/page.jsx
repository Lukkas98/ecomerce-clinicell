import { getCategories } from "@/lib/actions/categories";
import Link from "next/link";
import { getProduct } from "@/lib/actions/products";
import Form from "./components/form";

export default async function FormPage({ params, searchParams }) {
  const categories = await getCategories(true);
  const { form } = params;
  const { id } = searchParams;

  if (!categories.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            No se pueden crear productos
          </h2>
          <p className="text-gray-700 mb-6">
            Primero debes crear una categoría antes de poder subir un producto.
          </p>
          <Link
            href="/admin/panel?tab=categories"
            className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-all"
          >
            Crear Categoría
          </Link>
        </div>
      </div>
    );
  }

  let productEdit = {};
  if (form === "edit") {
    const product = await getProduct(id);
    const namedCategories = await product.getNamesCategories();
    productEdit = { ...product._doc };

    const FirstCategory = namedCategories[0].name;
    const additionalCategories = namedCategories.map((cat) => {
      return cat.name;
    });
    productEdit.category = await FirstCategory;
    productEdit.additionalCategories = await additionalCategories.slice(1);
  }

  return (
    <div className="border border-gray-700 p-3 rounded-lg bg-gray-700 shadow-lg mx-4 my-8 max-w-5xl lg:mx-auto">
      <Link
        className="inline-block px-4 py-2 bg-red-600 text-sm rounded-lg text-white font-semibold hover:bg-red-700 transition-all"
        href={"/admin/panel"}
      >
        Volver
      </Link>
      <h2 className="text-xl font-bold my-6 text-center text-gray-100">
        {form === "edit" ? "Actualizar Producto" : "Subir Producto"}
      </h2>
      <div className="p-1 rounded-lg shadow-md">
        <Form
          categories={categories}
          mode={form}
          initialData={JSON.parse(JSON.stringify(productEdit))}
        />
      </div>
    </div>
  );
}
