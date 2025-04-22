import Image from "next/image";
import ButtonsProd from "./buttonsProd";
import CheckboxStock from "./checkboxStock";
import CheckboxOutlet from "./checkboxOutlet";
import CheckboxDiscount from "./checkboxDiscount";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default function Product({ product }) {
  const isOutlet = product.outlet;
  const isDiscount = product.discount > 0;
  const inStock = product.stock;

  return (
    <div
      className={`relative bg-gray-800 rounded-lg p-3 shadow-lg border-2 
      ${inStock ? "border-green-500" : "border-red-500 opacity-85"}
      ${isOutlet && "border-orange-500"}
      grid gap-2 max-w-full w-full`}
    >
      <div className="flex gap-3 items-start">
        <div className="aspect-square w-20 relative shrink-0">
          <Image
            src={product.images[0]?.url || noImage}
            alt={product.name}
            className="rounded-md object-cover"
            fill
            quality={70}
            sizes="80px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-100 line-clamp-2">
            {product.name}
          </h2>

          <div className="flex items-baseline gap-2 mt-1">
            <>
              {isOutlet && (
                <div className="flex gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price}
                  </span>
                  <span className="text-lg font-medium text-orange-400">
                    ${Math.ceil(product.price * 0.7)}
                  </span>
                </div>
              )}

              {isDiscount && (
                <div className="flex gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price}
                  </span>
                  <span className="text-lg font-medium text-blue-400">
                    ${Math.ceil(product.discount)}
                  </span>
                </div>
              )}

              {!isOutlet && !isDiscount && (
                <span className="text-lg font-medium text-gray-300">
                  ${product.price}
                </span>
              )}
            </>
          </div>
        </div>
      </div>

      {/* Status Tags */}
      <div className="flex flex-wrap gap-2">
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
      <div className="grid grid-cols-2 gap-2 border-t border-gray-700 pt-2">
        <div className="flex flex-col gap-1.5">
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

        <div className="flex justify-end items-center">
          <ButtonsProd
            itemId={product._id.toString()}
            variant="icon"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

//diseño para futuro

// export default function Product({ product, categories, onEdit, onDelete }) {
//   return (
//     <div className="relative bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex h-36 mx-2 my-1 py-2.5 px-2">
//       {/* Etiqueta Outlet */}
//       {product.outlet && (
//         <div className="absolute top-1 right-20 bg-orange-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold z-10">
//           OUTLET
//         </div>
//       )}
//       {/* Etiqueta Stock */}
//       {!product.stock && (
//         <div className="absolute top-1 right-1 bg-orange-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold z-10">
//           Sin Stock
//         </div>
//       )}

//       {/* Contenedor Imagen - Relación 4:3 */}
//       <div className="h-full aspect-square bg-gray-700 flex items-center justify-center">
//         {product.images?.length > 0 ? (
//           <img
//             src={product.images[0].url || noImage}
//             alt={product.name}
//             className="w-full h-full"
//           />
//         ) : (
//           <span className="text-gray-400 text-xs">Sin imagen</span>
//         )}
//       </div>

//       {/* Contenido */}
//       <div className="flex-1 p-2 flex flex-col justify-between overflow-hidden">
//         {/* Sección Superior */}
//         <div className="flex flex-col gap-1 pt-2">
//           <h3 className="text-sm font-medium text-gray-100 truncate">
//             {product.name}
//           </h3>

//           <div className="flex items-center gap-1.5">
//             <span
//               className={`text-base ${
//                 product.outlet ? "text-red-400" : "text-gray-200"
//               }`}
//             >
//               ${product.price}
//             </span>
//             {product.outlet && (
//               <span className="line-through text-gray-400 text-xs">
//                 ${Math.round(product.price * 1.2)}
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Sección Inferior */}
//         <div className="flex justify-between items-end">
//           {/* Categorías */}
//           <div className="flex flex-col gap-1 overflow-hidden">
//             {categories.slice(0, 2).map((category, index) => (
//               <span
//                 key={index}
//                 className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-[10px] rounded-full truncate max-w-[80px]"
//               >
//                 {category}
//               </span>
//             ))}
//           </div>

//           {/* Botones Compactos */}
//           <div className="flex gap-1.5">
//             <button
//               onClick={onEdit}
//               className="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center text-xs"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-3 w-3 mr-1"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//               </svg>
//               Editar
//             </button>

//             <button
//               onClick={onDelete}
//               className="px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center text-xs"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-3 w-3"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
