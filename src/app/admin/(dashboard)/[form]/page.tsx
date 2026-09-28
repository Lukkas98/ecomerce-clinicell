import CreateProductForm from "./CreateProductForm";
import { getProductById } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";
import { notFound } from "next/navigation";

type FormMode = "create" | "edit";
type Params = Promise<{ form: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductFormPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { form } = await params;
  if (form !== "create" && form !== "edit") notFound();

  const mode = form as FormMode;
  const id = firstValue((await searchParams).id);
  const [product, categories] = await Promise.all([
    mode === "edit" && id ? getProductById(id) : Promise.resolve(null),
    getAllCategories(),
  ]);

  if (mode === "edit" && !product) notFound();

  return (
    <div className="dashboard-content">
      <h1 className="mb-2 text-2xl font-bold">
        {mode === "create" ? "Crear producto" : "Editar producto"}
      </h1>
      <p className="text-sm text-slate-500">
        {mode === "create"
          ? "Añade un nuevo producto a tu catálogo."
          : "Modifica los datos del producto."}
      </p>
      <CreateProductForm
        key={`${mode}-${product?._id ?? "new"}`}
        product={product}
        categories={categories}
        mode={mode}
      />
    </div>
  );
}
