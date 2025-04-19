import connectDB from "@/lib/ConectDB";
import { ProductModel } from "@/models/product";
import ClientInput from "./clientInput";
import { getPathnameProduct } from "@/lib/func";

export default async function ClientSearch() {
  await connectDB();
  const products = await ProductModel.find({}).lean();

  // Guardo las URLs para cada producto
  const productsWithUrls = await Promise.all(
    products.map(async (product) => {
      const url = await getPathnameProduct(product);
      return { ...product, url };
    })
  );

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <ClientInput products={JSON.parse(JSON.stringify(productsWithUrls))} />
    </div>
  );
}
