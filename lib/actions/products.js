"use server";
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { CategoryModel } from "@/models/category";
import { revalidatePath } from "next/cache";
// import { AdminStorage } from "../firebaseConfig/firebaseAdmin";
// import { updateFirebaseURLs } from "../actions";
import checkAdmin from "../firebaseConfig/checkAdmin";
import { getCategoryName } from "./categories";
import { cloudinaryApi, cloudinaryUploader } from "../cloudinary-config";

const Url = process.env.URL_FRONT;

export const getProducts = async (
  search = "",
  page = 1,
  filter = "",
  category = null,
  limit = 10,
  isAdmin = false
) => {
  try {
    await connectDB();

    let products;
    let totalPages;

    if (category && !search) {
      //cuando se ingresa busqueda se ignora la categoria
      const categoryObj = await getCategoryName(decodeURIComponent(category));
      totalPages = await getTotalPages(null, categoryObj._id, null, limit);
      products = await categoryObj.getSortedProducts(filter, page, limit);
    } else {
      //busqueda de todo
      products = await ProductModel.find()
        .byFilters(search, filter, page, limit)
        .exec();
      totalPages = await getTotalPages(search, null, filter, limit, isAdmin);
    }

    if (!products) throw new Error("No hay productos");
    return { products, totalPages };
  } catch (error) {
    return error.message;
  }
};

export const getTotalPages = async (
  search,
  categoryId,
  filter,
  limit = 10,
  isAdmin = false
) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (categoryId) query.category = categoryId;
  if (filter && isAdmin) query.stock = filter === "stock" ? true : false;

  const totalDocuments = await ProductModel.countDocuments(query);
  const totalPages = Math.ceil(totalDocuments / limit);
  return totalPages;
};

export const getProduct = async (id) => {
  try {
    await connectDB();
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("El producto no existe");
    }

    return product;
  } catch (error) {
    return error.message;
  }
};

export async function createProduct(formData, urls) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");

    await connectDB();
    const { name, price, stock, description, category, additionalCategories } =
      formData;

    const product = await ProductModel.findOne({
      name: { $regex: name, $options: "i" },
    });

    if (product && product.name.toLowerCase() === name.toLowerCase())
      throw new Error("Ya existe un producto con ese nombre, prueba con otro");

    let categoryObj = await CategoryModel.findOne({ name: category });
    if (!categoryObj) throw new Error("Categoría principal no encontrada");

    const additionalCategoriesIds = await CategoryModel.find({
      name: { $in: additionalCategories },
    }).select("_id");

    // Crear el nuevo producto
    const newProduct = await ProductModel.create({
      name,
      description,
      price,
      category: categoryObj._id,
      additionalCategories: additionalCategoriesIds, // Guardamos los IDs de las categorías adicionales
      stock,
      images: urls,
    });

    // Agregar el producto a la categoría principal
    categoryObj.products.push(newProduct._id);
    await categoryObj.save();
    //Agregar a las demás
    await CategoryModel.updateMany(
      { _id: { $in: additionalCategoriesIds } },
      { $push: { products: newProduct._id } }
    );

    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return { message: `Producto ${name} fue creado`, success: true };
  } catch (err) {
    return { message: `${err.message}`, success: false };
  }
}

//agregar funcion para cambiar outlet
export async function ChangeOutlet(id, currentOutlet = false) {
  try {
    if (!checkAdmin()) throw new Error("No eres administrador");
    await connectDB();

    const newOutletValue = !currentOutlet;
    await ProductModel.findByIdAndUpdate(id, { outlet: newOutletValue });

    revalidatePath(`${Url}/admin/panel`);
    return { message: "Outlet actualizado exitosamente", success: true };
  } catch (err) {
    console.error(err);
  }
}

export async function changeStock(id, currentStock = true) {
  try {
    if (!checkAdmin()) throw new Error("No eres administrador");
    await connectDB();

    const newStockValue = !currentStock;
    await ProductModel.findByIdAndUpdate(id, { stock: newStockValue });

    revalidatePath(`${Url}/admin/panel`);
    return { message: "Stock actualizado exitosamente", success: true };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function editProduct(dataProduct, Urls) {
  try {
    if (!checkAdmin()) throw new Error("No eres administrador");

    console.log("dataProduct", dataProduct);
    console.log("Urls", Urls);

    await connectDB();
    const { _id, name, price, description, category, additionalCategories } =
      dataProduct;

    const productName = await ProductModel.findOne({
      name: { $regex: name, $options: "i" },
    });

    if (
      productName &&
      productName.name.toLowerCase() === name.toLowerCase() &&
      _id !== productName._id.toString()
    ) {
      throw new Error("Ya existe un producto con ese nombre, prueba con otro");
    }

    const product = await ProductModel.findByIdAndUpdate(
      _id,
      { price, description },
      { new: true }
    );
    if (!product) throw new Error(`El producto id ${_id} no existe`);

    // Actualizar la categoría principal
    const currentCategory = await CategoryModel.findById(product.category);
    const newCategory = await CategoryModel.findOne({ name: category });
    if (!newCategory) throw new Error(`Categoría ${category} no encontrada`);

    if (currentCategory._id.toString() !== newCategory._id.toString()) {
      // Remover el producto de la categoría antigua
      await currentCategory.products.pull(product._id);
      await currentCategory.save();

      // Agregar el producto a la nueva categoría
      await newCategory.products.push(product._id);
      await newCategory.save();

      product.category = newCategory._id;
    }

    const additionalCategoryIds = await CategoryModel.find({
      name: { $in: additionalCategories },
    }).select("_id");

    const oldAdditionalCategoryIds = product.additionalCategories;
    const newAdditionalCategoryIds = additionalCategoryIds;

    const categoriesToRemove = oldAdditionalCategoryIds.filter(
      (id) => !newAdditionalCategoryIds.includes(id)
    );
    for (const categoryId of categoriesToRemove) {
      const categoryToRemove = await CategoryModel.findById(categoryId);
      await categoryToRemove.products.pull(product._id);
      await categoryToRemove.save();
    }

    // Agregar el producto a las nuevas categorías adicionales
    const categoriesToAdd = newAdditionalCategoryIds.filter(
      (id) => !oldAdditionalCategoryIds.includes(id)
    );
    for (const categoryId of categoriesToAdd) {
      const categoryToAdd = await CategoryModel.findById(categoryId);
      await categoryToAdd.products.push(product._id);
      await categoryToAdd.save();
    }

    product.additionalCategories = additionalCategoryIds;
    product.name = name;
    product.images = Urls;
    await product.save();

    revalidatePath(`${Url}/admin/panel`);
    return {
      message: `El producto ${product.name} se editó correctamente`,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function deleteProduct(productId) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");

    const product = await ProductModel.findByIdAndDelete(productId);
    if (!product) throw new Error(`El producto a borrar no existe`);

    const category = await CategoryModel.findById(product.category);
    await category.products.pull(productId);
    await category.save();

    await CategoryModel.updateMany(
      { _id: { $in: product.additionalCategories } },
      { $pull: { products: product._id } }
    );

    await deleteFolder(`${category.name}/${product.name}/`);
    revalidatePath(`${Url}/admin/panel`);
    return {
      success: true,
      message: `Producto ${product.name} borrado`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: `${error.message}` };
  }
}

export const deleteFolder = async (folderPath) => {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");
    const result = await cloudinaryApi.resources({
      type: "upload",
      prefix: folderPath,
      max_results: 50,
    });

    const publicIds = result.resources.map((resource) => resource.public_id);

    if (publicIds.length === 0) {
      console.log(`No se encontraron archivos en la carpeta ${folderPath}.`);
      return {
        message: `No se encontraron archivos en la carpeta ${folderPath}.`,
        success: true,
      };
    }

    const deleteResult = await cloudinaryApi.delete_resources(publicIds, {
      invalidate: true,
    });

    if (
      deleteResult.deleted === null ||
      Object.keys(deleteResult.deleted).length === 0
    ) {
      throw new Error("No se pudieron eliminar los archivos de Cloudinary");
    }

    console.log(`Todos los archivos en ${folderPath} fueron borrados.`);
    return {
      message: `Todos los archivos en ${folderPath} fueron borrados.`,
      success: true,
    };
  } catch (err) {
    console.error("Error al borrar la carpeta:", err.message);
    return {
      message: `Error al borrar la carpeta: ${err.message}`,
      success: false,
    };
  }
};
