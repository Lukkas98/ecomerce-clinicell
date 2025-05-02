import Header from "@/components/(header)/header";
import { Suspense } from "react";
import FooterComponent from "./home/components/fotter";
import { getCategories } from "@/lib/actions/categories";
import { ProductModel } from "@/models/product";
import connectDB from "@/lib/ConectDB";

export default async function CategoryLayout({ children }) {
  const categories = await getCategories();
  await connectDB();
  const result = await ProductModel.aggregate([
    {
      $facet: {
        outlet: [{ $match: { outlet: true } }, { $limit: 1 }],
        offers: [{ $match: { discount: { $gt: 0 } } }, { $limit: 1 }],
      },
    },
    {
      $project: {
        hasOutlet: { $gt: [{ $size: "$outlet" }, 0] },
        hasOffers: { $gt: [{ $size: "$offers" }, 0] },
      },
    },
  ]);

  const { hasOutlet, hasOffers } = result[0];

  return (
    <main className="bg-gray-900 relative text-gray-100 min-h-[100svh] flex flex-col justify-between lg:justify-stretch w-[100svw] min-w-full lg:grid max-w-[2000px] mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Header
          categories={JSON.parse(JSON.stringify(categories))}
          boleans={{ hasOutlet, hasOffers }}
        />
      </Suspense>

      <div className="max-w-full p-4">{children}</div>

      <FooterComponent />
    </main>
  );
}
