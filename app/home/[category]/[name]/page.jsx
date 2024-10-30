import ActionButton from "./components/actionButton";
import BtnBack from "./components/btnBack";
import Carousel from "./components/carousel";
import { getProduct } from "@/lib/actions/products";
import LinkNav from "./components/linkNav";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default async function ProductPage({ searchParams }) {
  const { id } = searchParams;
  const product = await getProduct(id);
  const { name, description, price, stock, images, category, outlet } = product;

  return (
    <div className="container relative max-w-7xl w-full mx-auto p-6 mt-5">
      <LinkNav
        idCategory={category}
        className="mb-4 text-xs absolute top-0 left-8"
      />
      <BtnBack />
      <div className="flex flex-col lg:flex-row lg:space-x-10 items-center">
        <div className="aspect-square w-full lg:w-1/2 rounded-lg relative max-w-[400px] lg:max-w-[500px]">
          <Carousel images={images} />
        </div>

        <div className="flex-1 mt-6 lg:mt-0">
          <h1
            className={`text-2xl font-bold ${
              outlet ? "text-orange-300" : "text-gray-200"
            }`}
          >
            {name}
          </h1>
          <p className="mt-4 text-gray-400">{description}</p>

          <div className="my-5">
            {outlet ? (
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-400 line-through">
                    $ {price}
                  </p>
                  <p className="text-orange-300 text-sm">Liquidación</p>
                </div>
                <p className="text-xl font-semibold text-green-500 flex items-center gap-2">
                  $ {Math.ceil(price - price * 0.3)}
                  <CheckBadgeIcon width={20} height={20} color="green" />
                </p>
              </div>
            ) : (
              <p className="block text-xl font-semibold text-indigo-600">
                $ {price}
              </p>
            )}
            <p
              className={`mt-2 text-sm font-medium ${
                stock ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock ? "En stock" : "Sin stock"}
            </p>
          </div>

          <ActionButton
            product={JSON.parse(JSON.stringify(product))}
            stock={product.stock}
            typeButton={"ADD_PRODUCT"}
            className={
              "px-5 py-3 hover:bg-gray-900 hover:outline outline-1 hover:outline-gray-200 rounded-md"
            }
          />
        </div>
      </div>
    </div>
  );
}
