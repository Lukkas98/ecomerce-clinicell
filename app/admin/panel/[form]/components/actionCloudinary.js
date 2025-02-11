"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

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

    const result = await cloudinary.uploader.upload(base64Image, {
      public_id: publicId,
      format: "webp",
      transformation: [{ quality: "auto", fetch_format: "webp" }],
      overwrite: true,
      folder: `${capCategory}/${capName}`,
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = imageUrl.split("/").slice(7).join("/").split(".")[0];
    console.log("publicId", publicId);

    await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
