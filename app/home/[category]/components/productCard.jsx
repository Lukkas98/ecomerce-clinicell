import { getCategoryId } from "@/lib/actions/categories";
import Image from "next/image";
import Link from "next/link";
import ActionButton from "../[name]/components/actionButton";

const noImage =
  "https://fakeimg.pl/300x300/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function ProductCard({ product, searchParams }) {
  const { images, name, price, stock, _id, category, description } = product;

  const { search } = searchParams;

  const categoryOfProduct = await getCategoryId(category);
  const urlPathname = `/home/${categoryOfProduct.name}/${name}`;

  return (
    <div
      className={`bg-gray-800 relative p-4 rounded-md shadow-lg flex flex-col justify-between ${
        stock ? "" : "opacity-50"
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
          quality={100}
          priority={true}
          className="object-contain mb-4 rounded-md outline outline-1 outline-gray-400 bg-gray-900"
        />
      </Link>
      <Link
        href={`${urlPathname}?id=${_id}`}
        className="text-lg font-semibold mb-2"
      >
        {name}
      </Link>

      <p className="text-sm line-clamp-2 text-gray-400 mb-2">{description}</p>
      <span className="font-bold text-lg text-gray-100 mb-4">$ {price}</span>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">
          {stock ? "En stock" : "Sin stock"}
        </span>
        <ActionButton
          product={JSON.parse(JSON.stringify(product))}
          stock={stock}
          typeButton="ADD_PRODUCT"
        />
      </div>
    </div>
  );
}
