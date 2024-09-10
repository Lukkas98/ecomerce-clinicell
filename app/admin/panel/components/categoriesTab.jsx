import BtnCreateCategory from "./btnCreateCat";
import Button from "./button";

export default function CategoriesTab({ data }) {
  return (
    <main className="grid gap-4 my-4 md:grid-cols-2 lg:grid-cols-4">
      <BtnCreateCategory />
      {data?.map((cat, i) => (
        <div
          className="px-3 py-2 max-w-xl bg-teal-50 mx-5 rounded-lg shadow-black shadow
               hover:bg-blue-400 hover:text-black transition-all flex justify-between"
          key={i}
        >
          <div className="mb-3">
            <p className="font-semibold text-lg">{cat.name}</p>
            <p className="text-sm">Productos: {cat.products.length}</p>
          </div>
          <Button categoryId={JSON.parse(JSON.stringify(cat._id))} />
        </div>
      ))}
    </main>
  );
}
