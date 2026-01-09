import { getCategories } from "@/lib/actions/categories";
import Link from "next/link";
import { getProduct } from "@/lib/actions/products";
import Form from "./components/form";

export const dynamicParams = false;

export async function generateStaticParams() {
  const formRoutes = ["create", "edit"];

  return formRoutes.map((form) => ({
    form: form,
  }));
}

export default async function FormPage({ params, searchParams }) {
  const { form } = await params;
  const { id } = await searchParams;
  const categories = await getCategories(true);

  if (!categories.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-6 text-center shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-red-600">
            No se pueden crear productos
          </h2>
          <p className="mb-6 text-gray-700">
            Primero debes crear una categoría antes de poder subir un producto.
          </p>
          <Link
            href="/admin/panel?tab=categories"
            className="inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-600"
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
    <div className="mx-4 my-8 max-w-5xl rounded-lg border border-gray-700 bg-gray-700 p-3 shadow-lg lg:mx-auto">
      <Link
        className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700"
        href={"/admin/panel"}
      >
        Volver
      </Link>
      <h2 className="my-6 text-center text-xl font-bold text-gray-100">
        {form === "edit" ? "Actualizar Producto" : "Subir Producto"}
      </h2>
      <div className="rounded-lg p-1 shadow-md">
        <Form
          categories={categories}
          mode={form}
          initialData={JSON.parse(JSON.stringify(productEdit))}
        />
      </div>
    </div>
  );
}
