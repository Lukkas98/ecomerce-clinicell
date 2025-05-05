"use server";
import { ProductModel } from "@/models/product";
import connectDB from "../ConectDB";
import { CategoryModel } from "@/models/category";
import { revalidatePath } from "next/cache";
import { getCategoryName } from "./categories";
import { cloudinaryApi } from "../cloudinary-config";
import { verifySession } from "../auth";

export const getProductsClient = async (
  page = 1,
  filter = "az",
  category = null,
  limit = 10
) => {
  try {
    await connectDB();
    const categoryObj = await getCategoryName(decodeURIComponent(category));
    const categoryId = categoryObj._id;

    const { products, totalPages } =
      await ProductModel.find().byCategoryWithFilters(
        categoryId,
        filter,
        page,
        limit
      );

    if (!products) throw new Error("No hay productos");
    return { products, totalPages };
  } catch (error) {
    return error.message;
  }
};

export const getProductsAdmin = async (
  search,
  filter = { sort: "az", stock: [], discount: [], outlet: [] },
  page = 1
) => {
  try {
    await connectDB();
    const { products, totalPages } = await ProductModel.find().byFilters(
      search,
      {
        sort: filter.sort,
        stock: filter.stock,
        discount: filter.discount,
        outlet: filter.outlet,
      },
      page
    );

    if (!products) throw new Error("No hay productos");
    return { products, totalPages };
  } catch (error) {
    return error.message;
  }
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

export const getOffertOutlet = async () => {
  try {
    await connectDB();
    const result = await ProductModel.aggregate([
      {
        $facet: {
          outlet: [{ $match: { outlet: true } }, { $limit: 1 }],
          offers: [{ $match: { discount: { $gt: 0 } } }, { $limit: 1 }],
        },
      },
      {
        $project: {
          hasOutlet: { $gt: [{ $size: "$outlet" }, 0] },
          hasOffers: { $gt: [{ $size: "$offers" }, 0] },
        },
      },
    ]);

    // { hasOutlet, hasOffers }
    return result[0];
  } catch (error) {
    console.error(error);
  }
};

export async function createProduct(formData, images = []) {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");

    await connectDB();
    const { name, price, description, stock, category, additionalCategories } =
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
      stock,
      category: categoryObj._id,
      additionalCategories: additionalCategoriesIds, // Guardamos los IDs de las categorías adicionales
      images: images.map((img) => ({
        url: img.url,
        publicId: img.publicId,
      })),
    });

    // Agregar el producto a la categoría principal
    categoryObj.products.push(newProduct._id);
    await categoryObj.save();
    //Agregar a las demás
    await CategoryModel.updateMany(
      { _id: { $in: additionalCategoriesIds } },
      { $push: { products: newProduct._id } }
    );

    revalidatePath(`/`, "layout");
    return { message: `Producto ${name} fue creado`, success: true };
  } catch (err) {
    return { message: `${err.message}`, success: false };
  }
}

export async function ChangeOutlet(id, currentOutlet = false) {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");
    await connectDB();

    const newOutletValue = !currentOutlet;
    await ProductModel.findByIdAndUpdate(id, { outlet: newOutletValue });

    revalidatePath(`/`, "layout");
    return { message: "Outlet actualizado", success: true };
  } catch (err) {
    console.error(err);
  }
}

export async function changeStock(id, currentStock = true) {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");
    await connectDB();

    const newStockValue = !currentStock;
    await ProductModel.findByIdAndUpdate(id, { stock: newStockValue });

    revalidatePath(`/`, "layout");
    return { message: "Stock actualizado", success: true };
  } catch (err) {
    console.error(err);
    return { message: `${err.message}`, success: false };
  }
}

export async function changeDiscount(id, discount) {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");
    await connectDB();

    await ProductModel.findByIdAndUpdate(id, { discount });
    revalidatePath(`/`, "layout");
    return { message: "Descuento actualizado", success: true };
  } catch (error) {
    return { message: `${err.message}`, success: false };
  }
}

export async function editProduct(dataProduct, newImages = []) {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");

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
    product.images = newImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));
    await product.save();

    revalidatePath(`/`, "layout");
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
    if (!(await verifySession())) throw new Error("No eres administrador");

    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("El producto a borrar no existe");

    // 1. Eliminar imágenes ANTES de borrar el producto (por si falla)
    const deleteResult = await deleteFolder(product.images);
    if (!deleteResult.success) throw new Error(deleteResult.message);

    // 2. Ahora borrar el producto
    await ProductModel.findByIdAndDelete(productId);

    // 3. Actualizar categorías
    await CategoryModel.findByIdAndUpdate(product.category, {
      $pull: { products: productId },
    });

    await CategoryModel.updateMany(
      { _id: { $in: product.additionalCategories } },
      { $pull: { products: productId } }
    );

    revalidatePath(`/`, "layout");
    return {
      success: true,
      message: `Producto "${product.name}" borrado con ${product.images.length} imagen(es) eliminada(s)`,
    };
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    return {
      success: false,
      message: `Error al borrar producto: ${error.message}`,
    };
  }
}

export const deleteFolder = async (images = []) => {
  try {
    if (!(await verifySession())) throw new Error("No eres administrador");

    if (!Array.isArray(images)) {
      throw new Error("El parámetro 'images' debe ser un array");
    }

    const validImages = images.filter(
      (img) => img?.publicId && typeof img.publicId === "string"
    );

    if (validImages.length === 0) {
      return {
        message: "No se encontraron archivos válidos para eliminar",
        success: true,
      };
    }

    const publicIds = validImages.map((img) => img.publicId);

    const deleteResult = await cloudinaryApi.delete_resources(publicIds, {
      type: "upload",
      resource_type: "image",
      invalidate: true,
    });

    // 5. Validación más completa del resultado
    if (
      !deleteResult.deleted ||
      Object.keys(deleteResult.deleted).length !== publicIds.length
    ) {
      const failedDeletes = publicIds.filter((id) => !deleteResult.deleted[id]);
      throw new Error(
        `No se pudieron eliminar todos los archivos. Fallidos: ${failedDeletes.join(
          ", "
        )}`
      );
    }

    return {
      message: `${publicIds.length} imagen(es) eliminada(s) correctamente`,
      success: true,
    };
  } catch (err) {
    console.error("Error en deleteFolder:", err);
    return {
      message: err.message.startsWith("Error en deleteFolder:")
        ? err.message
        : `Error en deleteFolder: ${err.message}`,
      success: false,
    };
  }
};
