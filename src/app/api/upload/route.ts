import { NextResponse } from "next/server";
import { cloudinaryUploader } from "@/lib/cloudinary-config";

export async function POST(request: Request) {
  try {
    const { base64Image, index, name, category } = (await request.json()) as {
      base64Image?: string;
      index?: number;
      name?: string;
      category?: string;
    };

    if (!base64Image || !name || !category || index === undefined) {
      return NextResponse.json(
        { error: "Faltan datos para subir la imagen" },
        { status: 400 },
      );
    }

    const productName = name
      .trim()
      .replace(/^\w/, (letter) => letter.toUpperCase());
    const categoryName = category
      .trim()
      .replace(/^\w/, (letter) => letter.toUpperCase());
    const result = await cloudinaryUploader.upload(base64Image, {
      public_id: `${productName}-${index}`,
      format: "webp",
      transformation: [{ quality: "auto", fetch_format: "webp" }],
      overwrite: true,
      folder: `${categoryName}/${productName}`,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error subiendo imagen: ${message}` },
      { status: 500 },
    );
  }
}
