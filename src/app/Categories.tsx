import { getAllCategories } from "@/lib/data/categories";

export async function Categories() {
  const categories = await getAllCategories();

  console.log("categories: ", categories);

  return (
    <>
      {categories.map((c) => (
        <li key={c._id}>{c.name}</li>
      ))}
    </>
  );
}
