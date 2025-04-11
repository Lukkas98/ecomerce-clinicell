"use server";
import { cloudinaryUploader } from "@/lib/cloudinary-config";
import { revalidatePath } from "next/cache";

export const uploadToCloudinary = async (
  base64Image,
  index,
  name,
  category
) => {
  try {
    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    const capCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const fileName = `${capName}-${index}`;

    const publicId = `${capCategory}/${capName}/${fileName}`;

    const result = await cloudinaryUploader.upload(base64Image, {
      public_id: publicId,
      format: "webp",
      transformation: [{ quality: "auto", fetch_format: "webp" }],
      overwrite: true,
      folder: `${capCategory}/${capName}`,
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  } finally {
    revalidatePath("/home");
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl.includes("res.cloudinary.com"))
      return { success: false, message: "URL no es de Cloudinary" };

    const decodedUrl = decodeURIComponent(imageUrl);
    const cleanUrl = decodedUrl.replace(/\/v\d+/, "").split("?")[0];

    const uploadIndex = cleanUrl.indexOf("/upload/") + 8;
    const publicIdWithExtension = cleanUrl.slice(uploadIndex);
    const publicId = publicIdWithExtension.split(".")[0];

    console.log("Extracted publicId:", publicId);

    const result = await cloudinaryUploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
      type: "upload",
    });

    if (result.result !== "ok")
      throw new Error(`Cloudinary error: ${result.result}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting:", error);
    return {
      success: false,
      message: error.message.replace("Cloudinary error: ", ""),
    };
  } finally {
    revalidatePath("/home");
  }
};
