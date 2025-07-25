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
      className={`relative bg-gray-800 rounded-lg p-3 shadow-lg border-2
      ${inStock ? "border-green-500" : "border-red-500 opacity-85"}
      ${isOutlet && "border-orange-500"}
      grid gap-2 min-w-[90%]`}
    >
      <div className="flex gap-3 items-start">
        <div className="aspect-square w-14 relative shrink-0">
          <Image
            src={product.images[0]?.url || noImage}
            alt={product.name}
            className="rounded-md object-cover"
            fill
            quality={70}
            sizes="56px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-100 line-clamp-2">
            {product.name}
          </h2>

          <div className="flex items-baseline gap-2 mt-2">
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
          <p className="text-xs mt-1.5">Unidades: {product.units}</p>
        </div>
      </div>

      {/* Status Tags */}
      <div className="flex gap-2 items-center mt-3">
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors
            ${
              inStock
                ? "bg-green-900/50 text-green-400"
                : "bg-red-900/50 text-red-400"
            }`}
        >
          {inStock ? "En stock" : "Sin stock"}
        </div>

        <div
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors
            ${
              isOutlet
                ? "bg-orange-900/50 text-orange-400"
                : "bg-gray-700/50 text-gray-400 opacity-50"
            }`}
        >
          Outlet
        </div>

        <div
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors
            ${
              isDiscount && !isOutlet
                ? "bg-blue-900/50 text-blue-400"
                : "bg-gray-700/50 text-gray-400 opacity-50"
            }`}
        >
          Oferta
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-2 border-t border-gray-700 pt-2 justify-between">
        <div className="flex flex-wrap gap-1.5">
          <CheckboxStock
            item={JSON.parse(JSON.stringify(product))}
            className="text-xs py-1 px-2"
          />
          {!product.discount && (
            <CheckboxOutlet
              item={JSON.parse(JSON.stringify(product))}
              className="text-xs py-1 px-2"
            />
          )}
          {!product.outlet && (
            <CheckboxDiscount
              item={JSON.parse(JSON.stringify(product))}
              className="text-xs py-1 px-2"
            />
          )}
        </div>
        <ButtonsProd itemId={product._id.toString()} variant="icon" size="sm" />
      </div>
    </div>
  );
}
