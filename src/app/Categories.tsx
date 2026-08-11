import { getAllCategories } from "@/lib/data/categories";
import Button from "./button";

export async function Categories() {
  const categories = await getAllCategories();

  return (
    <>
      {categories.map((c) => (
        <li key={c._id}>{c.name}</li>
      ))}
      <Button />
    </>
  );
}
