import LinkHeader from "@/components/(header)/linkHeader";
import { getCategories } from "@/lib/actions";

export default async function DesktopMenu({}) {
  const categories = await getCategories();
  return (
    <aside className=" hidden lg:inline-block border-r-2 border-blue-100">
      <nav>
        {/* <p className="mt-4 px-5">Filtros</p> */}
        <ul className=" mt-10 flex flex-col gap-3 px-5">
          <li className="flex">
            <LinkHeader
              categoryName={"todos"}
              className={"w-full border-b-2 border-blue-600 px-3 py-1 hover:border-black transition-all"}
            />
          </li>
          {categories?.map((category) => (
            <li key={category._id} className="flex flex-col" >
              <LinkHeader
                categoryName={category.name}
                className={"w-full border-b-2 border-blue-600 px-3 py-1 hover:border-black transition-all"}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
