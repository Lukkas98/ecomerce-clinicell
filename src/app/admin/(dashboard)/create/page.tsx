export default function CreatePage() {
  return (
    <div className="dashboard-content">
      <h1 className="mb-2 text-2xl font-bold">Crear producto</h1>
      <p className="text-sm text-slate-500">Añade un nuevo producto a tu catálogo.</p>
      <div className="dashboard-card mt-6 p-5">
        <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm font-medium text-slate-400">Subir imagen</div>
        <button className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white">Continuar</button>
      </div>
    </div>
  );
}
