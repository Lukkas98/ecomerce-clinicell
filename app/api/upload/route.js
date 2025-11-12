import { NextResponse } from "next/server";
import { cloudinaryUploader } from "@/lib/cloudinary-config";
import { verifySession } from "@/lib/auth";

export const revalidate = false;

export async function POST(req) {
  try {
    if (!(await verifySession()))
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { base64Image, index, name, category } = await req.json();

    const capName = name.charAt(0).toUpperCase() + name.slice(1).trim();
    const capCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const fileName = `${capName}-${index}`;

    const result = await cloudinaryUploader.upload(base64Image, {
      public_id: fileName,
      format: "webp",
      transformation: [{ quality: "auto", fetch_format: "webp" }],
      overwrite: true,
      folder: `${capCategory}/${capName}`,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Error subiendo imagen: ${error.message}` },
      { status: 500 },
    );
  }
}
