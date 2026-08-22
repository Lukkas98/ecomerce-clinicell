import type { ProductDTO } from "@/lib/types/products";
import Link from "next/link";
import type { Route } from "next";

export default function ProductsGrid({ products }: { products: ProductDTO[] }) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <article
          className={`dashboard-card flex items-center gap-3 border-l-4 p-3 ${
            product.outlet.isActive
              ? "border-l-orange-400"
              : product.offert > 0
                ? "border-l-blue-500"
                : "border-l-transparent"
          }`}
          key={product._id}
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {product.images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="h-full w-full object-cover" src={product.images[0].url} />
            ) : (
              <PackageIcon />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-bold">{product.name}</h2>
              {product.outlet.isActive ? (
                <span className="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
                  Outlet
                </span>
              ) : product.offert > 0 ? (
                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                  Oferta
                </span>
              ) : null}
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">{product.description}</p>
            {product.outlet.isActive || product.offert > 0 ? (
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xs text-slate-400 line-through">
                  ${product.price.toLocaleString("es-AR")}
                </span>
                <span className={`text-sm font-bold ${
                  product.outlet.isActive ? "text-orange-600" : "text-blue-600"
                }`}>
                  ${product.calculatedPrice.toLocaleString("es-AR")}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-sm font-bold text-blue-600">
                ${product.price.toLocaleString("es-AR")}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
              product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}>
              {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
            </span>
            <div className="flex gap-1">
              <Link
                aria-label={`Editar ${product.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                href={`/admin/edit?id=${product._id}` as Route}
              >
                <EditIcon />
              </Link>
              <button
                aria-label={`Eliminar ${product.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                type="button"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
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

function EditIcon() {
  return <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18"><path d="m4 16-.8 4.8L8 20l11.5-11.5a2.8 2.8 0 0 0-4-4L4 16Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /><path d="m13.5 6.5 4 4" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

function TrashIcon() {
  return <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}
