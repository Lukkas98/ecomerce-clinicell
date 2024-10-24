import ProductCard from "@/app/home/[category]/components/productCard.jsx";
import ShowMoreProducts from "./ShowMoreProducts.jsx";
import { ProductModel } from "@/models/product.js";

export default async function Outlet() {
  const products = await ProductModel.find({ outlet: true }).sort({ name: 1 });

  return (
    <>
      {products.length > 0 && (
        <section className="container mx-auto bg-slate-800 bg-opacity-30 rounded-3xl p-10 mb-2">
          <div>
            <h2 className="text-lg font-bold text-center mb-4">
              Sector Outlet - Liquidación
            </h2>
            <div className="flex flex-col justify-center items-center">
              {products.length > 0 && (
                <ShowMoreProducts>
                  {products.map((prod, i) => (
                    <ProductCard product={prod} key={i} />
                  ))}
                </ShowMoreProducts>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
