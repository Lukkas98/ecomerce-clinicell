import ActionButton from "@/components/(productCard)/actionButton";
import Carousel from "./components/carousel";
import { getProduct } from "@/lib/actions/products";

export default async function ProductPage({ params }) {
  const { id } = params;
  const product = await getProduct(id);

  return (
    <section className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        <div className="w-full md:w-1/2">
          <Carousel images={product.images} />
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-lg text-gray-700 mb-2">${product.price}</p>
          <p className="text-sm text-gray-500 mb-4">
            {product.stock ? "Stock disponible" : "Fuera de stock"}
          </p>
          <ActionButton
            product={JSON.parse(JSON.stringify(product))}
            stock={product.stock}
            typeButton={"ADD_PRODUCT"}
          />
          <p className="text-base text-gray-700 mb-4 md:mt-5">
            {product.description}
          </p>
        </div>
      </div>
    </section>
  );
}
