import Image from "next/image";
import ButtonsProd from "./buttonsProd";
import CheckboxStock from "./checkboxStock";
import CheckboxOutlet from "./checkboxOutlet";
import CheckboxDiscount from "./checkboxDiscount";

const noImage = "https://dummyimage.com/70x70";
// "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default function Product({ product }) {
  const isOutlet = product.outlet;
  const isDiscount = product.discount > 0;
  const inStock = product.stock;

  return (
    <div
      className={`relative rounded-lg border-2 bg-gray-800 p-3 shadow-lg ${inStock ? "border-green-500" : "border-red-500 opacity-85"} ${isOutlet && "border-orange-500"} grid min-w-[90%] gap-2`}
    >
      <div className="flex items-start gap-3">
        <div className="relative aspect-square w-14 shrink-0">
          <Image
            src={product.images[0]?.url || noImage}
            alt={product.name}
            className="rounded-md object-cover"
            fill
            quality={70}
            sizes="56px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-sm font-semibold text-gray-100">
            {product.name}
          </h2>

          <div className="mt-2 flex items-baseline gap-2">
            <>
              {isOutlet && (
                <div className="flex gap-2">
                  <span className="text-xs text-gray-400 line-through">
                    ${product.price}
                  </span>
                  <span className="text-sm font-medium text-orange-400">
                    ${Math.ceil(product.price * 0.7)}
                  </span>
                </div>
              )}

              {isDiscount && (
                <div className="flex gap-2">
                  <span className="text-xs text-gray-400 line-through">
                    ${product.price}
                  </span>
                  <span className="text-sm font-medium text-blue-400">
                    ${Math.ceil(product.discount)}
                  </span>
                </div>
              )}

              {!isOutlet && !isDiscount && (
                <span className="text-sm font-medium text-gray-300">
                  ${product.price}
                </span>
              )}
            </>
          </div>
          <p className="mt-1.5 text-xs">Unidades: {product.units}</p>
        </div>
      </div>

      {/* Status Tags */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className={`cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-colors ${
            inStock
              ? "bg-green-900/50 text-green-400"
              : "bg-red-900/50 text-red-400"
          }`}
        >
          {inStock ? "En stock" : "Sin stock"}
        </div>

        <div
          className={`cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-colors ${
            isOutlet
              ? "bg-orange-900/50 text-orange-400"
              : "bg-gray-700/50 text-gray-400 opacity-50"
          }`}
        >
          Outlet
        </div>

        <div
          className={`cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-colors ${
            isDiscount && !isOutlet
              ? "bg-blue-900/50 text-blue-400"
              : "bg-gray-700/50 text-gray-400 opacity-50"
          }`}
        >
          Oferta
        </div>
      </div>

      {/* Controles */}
      <div className="flex justify-between gap-2 border-t border-gray-700 pt-2">
        <div className="flex flex-wrap gap-1.5">
          <CheckboxStock
            item={JSON.parse(JSON.stringify(product))}
            className="px-2 py-1 text-xs"
          />
          {!product.discount && (
            <CheckboxOutlet
              item={JSON.parse(JSON.stringify(product))}
              className="px-2 py-1 text-xs"
            />
          )}
          {!product.outlet && (
            <CheckboxDiscount
              item={JSON.parse(JSON.stringify(product))}
              className="px-2 py-1 text-xs"
            />
          )}
        </div>
        <ButtonsProd itemId={product._id.toString()} variant="icon" size="sm" />
      </div>
    </div>
  );
}
