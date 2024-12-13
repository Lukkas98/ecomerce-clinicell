import BtnCreateCategory from "./btnCreateCat";
import Button from "./button";

export default async function CategoriesTab({ data }) {
  const mainCategories = data.filter((cat) => cat.parentCategory === null);

  return (
    <div className="space-y-4 mt-5 mb-16">
      {/* Botón para crear categoría */}
      <div className="flex justify-center">
        <BtnCreateCategory
          categories={JSON.parse(JSON.stringify(mainCategories))}
        />
      </div>

      {/* Listado de categorías principales y subcategorías */}
      {mainCategories.map((mainCat, i) => (
        <div
          key={i}
          className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Categoría principal */}
          <div className="flex justify-between items-center px-4 py-3 bg-blue-700">
            <div>
              <p className="font-bold text-lg">{mainCat.name}</p>
              <p className="text-sm text-gray-300">
                Categorias: {mainCat.subcategories.length}
              </p>
            </div>
            <Button
              category={JSON.parse(JSON.stringify(mainCat))}
              subcategories={JSON.parse(JSON.stringify(mainCat.subcategories))}
            />
          </div>

          {/* Subcategorías */}
          <div className="space-y-2 bg-gray-700 px-4 py-3">
            {mainCat.subcategories?.length > 0 ? (
              mainCat.subcategories.map((subCat, j) => (
                <div
                  key={j}
                  className="flex justify-between items-center px-3 py-2 bg-gray-800
                  rounded shadow hover:bg-gray-700 transition-all hover:outline outline-2 outline-blue-800"
                >
                  <div>
                    <p className="font-medium">{subCat.name}</p>
                    <p className="text-sm text-gray-400">
                      Productos: {subCat.products.length}
                    </p>
                  </div>
                  <Button category={JSON.parse(JSON.stringify(subCat))} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Sin subcategorías</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
