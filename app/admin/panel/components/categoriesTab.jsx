import BtnCreateCategory from "./btnCreateCat";
import Button from "./button";

export default function CategoriesTab({ data }) {
  return (
    <div className="grid gap-4 mt-5 mb-16 justify-center md:grid-cols-2 lg:grid-cols-3">
      <BtnCreateCategory />
      {data?.map((cat, i) => (
        <div
          className="px-4 py-3 max-w-xl bg-gray-800 text-white mx-5 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all flex justify-between"
          key={i}
        >
          <div className="mb-3">
            <p className="font-semibold text-lg">{cat.name}</p>
            <p className="text-sm text-gray-400">
              Productos: {cat.products.length}
            </p>
          </div>
          <Button categoryId={JSON.parse(JSON.stringify(cat._id))} />
        </div>
      ))}
    </div>
  );
}
