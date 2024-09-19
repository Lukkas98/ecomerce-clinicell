"use server";
import { CategoryModel } from "@/models/category";
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { revalidatePath } from "next/cache";
import checkAdmin from "../firebaseConfig/checkAdmin";
import { deleteFolder } from "./products";
import { AdminStorage } from "../firebaseConfig/firebaseAdmin";
import { updateFirebaseURLs } from "../actions";

const Url = process.env.URL_FRONT;

export const getCategories = async (isFront = false) => {
  try {
    await connectDB();
    const categories = isFront
      ? await CategoryModel.find({}).lean().sort({ name: 1 })
      : await CategoryModel.find({}).sort({ name: 1 });

    if (!categories) {
      throw new Error("No hay Categorias");
    }

    if (isFront) {
      const jsonString = JSON.stringify(categories);
      const objJson = await JSON.parse(jsonString);
      return objJson;
    }

    return categories;
  } catch (error) {
    return error.message;
  }
};

export const getCategoryId = async (id) => {
  try {
    await connectDB();
    const category = await CategoryModel.findById(id).populate("products");

    if (!category) {
      throw new Error(`La categoria id: %s no existe`, id);
    }

    return category;
  } catch (error) {
    return error.message;
  }
};

export const getCategoryName = async (name) => {
  try {
    await connectDB();
    const category = await CategoryModel.findOne({
      name: { $regex: name, $options: "i" },
    }).populate("products");

    if (!category) throw new Error(`La categoria %s no existe`, name);

    return category;
  } catch (error) {
    return error.message;
  }
};

export async function createCategory(name) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");
    await connectDB();

    let categoryObj = await CategoryModel.findOne({
      name: { $regex: name, $options: "i" },
    });
    if (categoryObj)
      throw Error("Esa categoria ya existe, prueba con otro nombre");

    categoryObj = await CategoryModel.create({
      name,
      products: [],
    });

    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return { message: `Categoría: ${categoryObj.name} creada`, success: true };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function DeleteCategory(id) {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");
    await connectDB();

    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      throw new Error(`La categoria id: %s no existe`, id);
    }

    await category.products.forEach(async (product) => {
      await ProductModel.findByIdAndDelete(product._id);
    });
    await deleteFolder(`productos/${category.name}/`);

    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return {
      message: `La categoria ${category.name} se borro exitosamente.
Se eliminaron ${category.products.length} productos`,
      success: true,
    };
  } catch (error) {
    return { message: `${err.message}`, success: false };
  }
}

export const editCategory = async (id, newName) => {
  try {
    if (!checkAdmin()) throw Error("No eres administrador");
    await connectDB();

    const category = await CategoryModel.findById(id);
    if (!category) throw new Error("La categoria no existe");

    const products = await ProductModel.find({ category: category._id });
    const capNewName =
      newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase();

    for (const product of products) {
      const oldCategoryPath = `productos/${category.name}/${product.name}/`;
      const newCategoryPath = `productos/${capNewName}/${product.name}/`;

      const [files] = await AdminStorage.bucket().getFiles({
        prefix: oldCategoryPath,
      });
      const MoveFiles = files.map(async (file, i) => {
        await file.move(`${newCategoryPath}${product.name}-${i}`);
      });
      await Promise.all(MoveFiles);

      const updateUrl = await updateFirebaseURLs(
        product.images,
        capNewName,
        product.name
      );
      product.images = updateUrl;
      await product.save();
    }

    category.name = newName;
    await category.save();

    revalidatePath(`${Url}/admin/panel`);
    revalidatePath(`${Url}/admin/panel/create`);
    return { message: `Categoria actualizada`, success: true };
  } catch (error) {
    return { message: `${error.message}`, success: false };
  }
};
