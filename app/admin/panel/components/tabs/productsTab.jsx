import Image from "next/image";
import ButtonsProd from "../buttonsProd";
import CheckboxStock from "../checkboxStock";
import Paginate from "@/components/paginate";
import LoadingProducts from "@/components/loadingProducts";
import { Suspense } from "react";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

const categoryProd = async (product) => {
  const categories = await product.getNamesCategories();
  return categories.map((cat) => (
    <p className="line-clamp-1" key={cat._id}>
      {cat.name}
    </p>
  ));
};

export default async function ProductsTab({ data }) {
  const totalPages = data.totalPages;

  return (
    <div className="flex-1 p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-5">
      <div className="md:col-span-2 lg:col-span-3">
        <Paginate totalPages={totalPages} />
      </div>
      <Suspense key={Date.now()} fallback={<LoadingProducts />}>
        {data.products?.map((item) => (
          <div
            key={item._id}
            className={`border-2 p-3 rounded-lg bg-gray-800 w-full mx-auto grid justify-items-center grid-cols-[110px,auto] gap-4 shadow-lg ${
              item.stock ? "border-green-500 text-black" : "border-red-500"
            }`}
          >
            <div
              className={`aspect-square w-[100px] relative overflow-hidden rounded-lg ${
                item.images[0] ? "shadow-md shadow-black" : ""
              }`}
            >
              <Image
                src={item.images[0] || noImage}
                alt={item.name + " image"}
                fill={true}
                sizes="100px"
                className="object-contain"
                quality={80}
              />
            </div>
            <div className="text-sm text-gray-400 mt-2 relative">
              <p className="absolute -top-4 font-semibold border-b border-gray-400 pb-0.5">
                Categorias:
              </p>
              <div className="mt-2">{categoryProd(item)}</div>
            </div>

            <div className="w-full flex flex-col justify-between col-span-2">
              <h2
                className="text-lg font-semibold text-white"
                title={item.name}
              >
                {item.name}
              </h2>

              <div className="flex justify-between items-center my-2">
                <p className="text-base font-medium text-gray-300">
                  $ {item.price}
                </p>

                <CheckboxStock item={JSON.parse(JSON.stringify(item))} />
              </div>
            </div>

            <ButtonsProd itemId={item._id.toString()} />
          </div>
        ))}
      </Suspense>
      <div className="md:col-span-2 lg:col-span-3">
        <Paginate totalPages={totalPages} />
      </div>
    </div>
  );
}
