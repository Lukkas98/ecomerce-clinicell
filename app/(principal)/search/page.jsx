import Paginate from "@/components/paginate";
import { getProductsAdmin } from "@/lib/actions/products";
import ActionButton from "../[parentCategory]/[category]/[name]/components/actionButton";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { getPathnameProduct } from "@/lib/func";

const noImage =
  "https://fakeimg.pl/150x150/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default async function SearchPage({ searchParams }) {
  const { q, page } = await searchParams;

  const { products, totalPages } = await getProductsAdmin(
    q,
    "stock",
    Number(page)
  );

  return (
    <section className="mb-6 gap-3 below-320:grid-cols-1 grid place-content-center">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-200 text-center mb-4">
          Busqueda - {q}
        </h1>
        <div className="below-320:col-span-1 col-span-2">
          <Paginate totalPages={totalPages} />
        </div>
        <div className="grid below-320:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 mx-3 lg:mx-5">
          {products.map(async (product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg p-2 min-w-[120px] border border-gray-700 flex flex-col justify-between gap-2
                hover:bg-gray-900 hover:shadow shadow-black hover:border-white transition-all"
            >
              <Link
                className="cursor-pointer"
                href={`${await getPathnameProduct(product)}`}
              >
                <div className="aspect-square w-[100%] max-w-[200px] mb-4 relative mx-auto overflow-hidden rounded-md">
                  <Image
                    src={
                      product.images[0]?.length ? product.images[0] : noImage
                    }
                    alt={product.name}
                    className="object-contain"
                    fill={true}
                    sizes="200px"
                    quality={100}
                  />
                </div>
                <h3 className="text-lg text-orange-300 font-semibold line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              <p className="text-base text-gray-200 line-clamp-2 mb-3">
                {product.description}
              </p>
              <div className="grid place-content-start">
                <p className="text-sm text-gray-400 line-through">
                  ${product.price}
                </p>
                <p className="text-lg font-bold text-green-500 flex items-center gap-1">
                  ${(product.price - product.price * 0.3).toFixed(2)}
                  <CheckBadgeIcon width={20} height={20} color="green" />
                </p>
              </div>
              <ActionButton
                product={JSON.parse(JSON.stringify(product))}
                stock={product.stock}
                typeButton="ADD_PRODUCT"
              />
            </div>
          ))}
        </div>
        <div className="below-320:col-span-1 col-span-2 lg:col-span-3">
          <Paginate totalPages={totalPages} />
        </div>
      </div>
    </section>
  );
}
