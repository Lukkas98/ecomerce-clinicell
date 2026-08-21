import type { ProductDTO } from "@/lib/types/products";

export default function ProductsGrid({ products }: { products: ProductDTO[] }) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <article className="dashboard-card flex items-center gap-3 p-3" key={product._id}>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {product.images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="h-full w-full object-cover" src={product.images[0].url} />
            ) : (
              <PackageIcon />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold">{product.name}</h2>
            <p className="mt-1 truncate text-xs text-slate-500">{product.description}</p>
            <p className="mt-2 text-sm font-bold text-blue-600">
              ${product.calculatedPrice.toLocaleString("es-AR")}
            </p>
          </div>
          <span className={`self-start rounded-full px-2 py-1 text-[10px] font-semibold ${
            product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          }`}>
            {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
          </span>
        </article>
      ))}
      {products.length === 0 ? (
        <div className="dashboard-card p-8 text-center text-sm text-slate-500">
          No se encontraron productos.
        </div>
      ) : null}
    </div>
  );
}

function PackageIcon() {
  return <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24"><path d="m4 8 8-4 8 4v9l-8 4-8-4V8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /><path d="m4 8 8 4 8-4M12 12v9" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}
