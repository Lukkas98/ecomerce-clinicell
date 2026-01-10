import BtnCreateCategory from "./btnCreateCat";
import Button from "./button";
import SubcategoryItem from "./subcategoryItem";

export default async function CategoriesTab({ data }) {
  const mainCategories = data.filter((cat) => cat.parentCategory === null);

  return (
    <div className="mt-5 mb-16 space-y-4">
      <div className="flex justify-center">
        <BtnCreateCategory
          categories={JSON.parse(JSON.stringify(mainCategories))}
        />
      </div>

      {mainCategories.map((mainCat, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg bg-gray-800 text-white shadow-lg"
        >
          <div className="flex items-center justify-between bg-blue-700 px-4 py-3">
            <div>
              <p className="text-lg font-bold">{mainCat.name}</p>
              <p className="text-sm text-gray-300">
                Subcategorías: {mainCat.subcategories.length}
              </p>
            </div>
            <Button
              category={JSON.parse(JSON.stringify(mainCat))}
              subcategories={JSON.parse(JSON.stringify(mainCat.subcategories))}
            />
          </div>

          <div className="space-y-2 bg-gray-700 px-4 py-3">
            {mainCat.subcategories?.length > 0 ? (
              mainCat.subcategories.map((subCat, j) => (
                <SubcategoryItem
                  key={j}
                  subcategory={JSON.parse(JSON.stringify(subCat))}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400">Sin subcategorías</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
