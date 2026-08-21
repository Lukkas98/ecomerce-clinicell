import CreateProductForm from "./CreateProductForm";

export default function CreatePage() {
  return (
    <div className="dashboard-content">
      <h1 className="mb-2 text-2xl font-bold">Crear producto</h1>
      <p className="text-sm text-slate-500">Añade un nuevo producto a tu catálogo.</p>
      <CreateProductForm />
    </div>
  );
}
