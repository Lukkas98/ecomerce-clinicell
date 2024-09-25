import ActionButton from "./components/actionButton";
import BtnBack from "./components/btnBack";
import Carousel from "./components/carousel";
import { getProduct } from "@/lib/actions/products";
import LinkNav from "./components/linkNav";

export default async function ProductPage({ searchParams }) {
  const { id } = searchParams;
  const product = await getProduct(id);
  const { name, description, price, stock, images, category } = product;

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
          <h1 className="text-3xl font-bold text-gray-200">{name}</h1>
          <p className="mt-4 text-gray-400">{description}</p>

          <div className="my-5">
            <span className="block text-xl font-semibold text-indigo-600">
              $ {price}
            </span>
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
