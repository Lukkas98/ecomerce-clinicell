import ActionButton from "./components/actionButton";
import Carousel from "./components/carousel";
import { getProduct } from "@/lib/actions/products";

export default async function ProductPage({ searchParams }) {
  const { id } = searchParams;
  const product = await getProduct(id);
  const { name, description, price, stock, images } = product;

  return (
    <div className="container max-w-7xl w-full mx-auto p-6">
      {/* Contenedor del producto */}
      <div className="flex flex-col lg:flex-row lg:space-x-10 items-center">
        {/* Imagen del producto (div con color de fondo) */}
        <div className="bg-gray-200 aspect-square w-full lg:w-1/2 rounded-lg relative max-w-[400px] lg:max-w-[500px]">
          <Carousel images={images} />
        </div>

        {/* Detalles del producto */}
        <div className="flex-1 mt-6 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-200">{name}</h1>
          <p className="mt-4 text-gray-400">{description}</p>

          {/* Precio y stock */}
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
          />
        </div>
      </div>
    </div>
  );
}
