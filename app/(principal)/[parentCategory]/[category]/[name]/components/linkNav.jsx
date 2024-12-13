import { getCategoryId } from "@/lib/actions/categories";
import Link from "next/link";

// Modificar más adelante

export default async function LinkNav({ idCategory, className = "" }) {
  const category = await getCategoryId(idCategory);
  const { name } = category;

  return (
    <div className={`${className} text-gray-400 `}>
      <p className="inline-block cursor-default">Home /</p>
      <Link
        className="hover:text-gray-200 hover:underline"
        href={`/home/${name}`}
      >{`${name}`}</Link>
    </div>
  );
}
