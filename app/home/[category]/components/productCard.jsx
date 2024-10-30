import { getCategoryId } from "@/lib/actions/categories";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../[name]/components/actionButton";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

const noImage =
  "https://fakeimg.pl/300x300/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, _id, category, description, outlet } =
    product;

  // const { search } = searchParams;

  const categoryOfProduct = await getCategoryId(category);
  const urlPathname = `/home/${categoryOfProduct.name}/${name}`;

  return (
    <div
      className={`bg-gray-800 relative p-4 rounded-md shadow-lg flex gap-1 flex-col justify-between transition-all ${
        stock
          ? "hover:bg-gray-900 hover:outline hover:outline-green-700"
          : "opacity-50"
      }`}
    >
      <Link
        href={`${urlPathname}?id=${_id}`}
        className="w-full aspect-square relative"
      >
        <Image
          src={images[0] || noImage}
          fill={true}
          alt="imgProduct"
          sizes="(max-width: 768px) 150px, (max-width: 1200px) 200px, 500px"
          quality={80}
          priority={true}
          className="object-contain mb-4 rounded-md outline outline-1 outline-gray-400 bg-gray-900"
        />
      </Link>
      <Link
        href={`${urlPathname}?id=${_id}`}
        className={`text-base font-semibold mb-2 line-clamp-2 ${
          outlet ? "text-orange-400" : "text-gray-200"
        }`}
        title={name}
      >
        {name}
      </Link>

      <p className="text-sm line-clamp-2 text-gray-400 mb-2">{description}</p>
      {!outlet ? (
        <p className="font-bold text-lg text-gray-100 mb-4">$ {price}</p>
      ) : (
        <div>
          {outlet && (
            <p className={`text-sm text-orange-400 mt-1`}>Liquidación</p>
          )}
          <p className="text-sm line-through text-gray-400">$ {price}</p>
          <p className="text-lg font-bold text-green-500 flex items-center gap-2">
            $ {Math.ceil(price - price * 0.3)}
            <CheckBadgeIcon width={20} height={20} color="green" />
          </p>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className={`text-sm ${stock ? "text-green-500" : "text-red-500"}`}>
          {stock ? "En stock" : "Sin stock"}
        </p>
        <ActionButton
          product={JSON.parse(JSON.stringify(product))}
          stock={stock}
          typeButton="ADD_PRODUCT"
        />
      </div>
    </div>
  );
}
