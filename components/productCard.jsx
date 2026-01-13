import Image from "next/image";
import Link from "next/link";
import ActionButton from "../app/(principal)/[parentCategory]/[category]/[name]/components/actionButton";
import { getPathnameProduct } from "@/lib/func";

const noImage = "https://dummyimage.com/500x500?text=Sin+Imagen";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, description, outlet, discount, units } =
    product;

  const onSale = discount > 0;
  const discountPercentage = Math.round(((price - discount) / price) * 100);
  const linkTo = await getPathnameProduct(product);

  return (
    <div
      className={`group flex h-fit w-full rounded-xl border border-gray-700 bg-linear-to-br from-gray-800 to-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500 hover:shadow-2xl ${stock ? "" : "opacity-50"}`}
    >
      <div className="relative aspect-square w-1/3 shrink-0 overflow-hidden">
        {onSale && (
          <div className="absolute top-2 right-2 z-10 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg shadow-purple-900/30">
            Oferta
          </div>
        )}
        {outlet && (
          <div className="absolute top-2 right-2 z-10 rounded-full bg-linear-to-r from-orange-500 to-red-700 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg shadow-purple-900/30">
            Outlet
          </div>
        )}

        <Link
          href={linkTo}
          className="relative flex h-full w-full items-center justify-center"
        >
          <Image
            src={images[0]?.url || noImage}
            fill={true}
            alt="imgProduct"
            sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 500px"
            priority={true}
            className="rounded-2xl bg-gray-900 object-contain"
          />
        </Link>
      </div>

      <div className="flex grow flex-col justify-between p-3">
        <div>
          <Link href={linkTo} className="mb-1.5">
            <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-cyan-300">
              {name}
            </h3>
            <p className="mt-1 mb-2 line-clamp-1 text-xs text-gray-400 transition-colors group-hover:text-gray-300">
              {description}
            </p>
          </Link>

          <div className="mt-1.5">
            {onSale || outlet ? (
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-sm font-bold text-white">
                  {outlet ? Math.ceil(product.price * 0.7) : `${discount}`}
                </span>
                <span className="text-[10px] text-gray-400 line-through">
                  ${price}
                </span>
                <span className="ml-1 bg-linear-to-r from-pink-500 to-purple-500 bg-clip-text text-[10px] font-bold text-transparent">
                  {onSale ? `${discountPercentage} % OFF` : "30% OFF"}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-white">${price}</span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            {stock ? (
              <div className="flex items-center">
                <div className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-linear-to-r from-green-400 to-emerald-500"></div>
                <span className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-[10px] font-medium text-transparent">
                  {units === 1 ? "Última unidad" : `${units} disponibles`}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="mr-1.5 h-2 w-2 rounded-full bg-linear-to-r from-red-400 to-red-500"></div>
                <span className="bg-linear-to-r from-red-400 to-red-500 bg-clip-text text-[10px] font-medium text-transparent">
                  Agotado
                </span>
              </div>
            )}
          </div>

          <ActionButton product={JSON.parse(JSON.stringify(product))} />
        </div>
      </div>
    </div>
  );
}
