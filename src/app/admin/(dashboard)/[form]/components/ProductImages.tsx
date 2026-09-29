"use client";

import type { ProductImage } from "@/lib/types/products";

type ImagePreview = ProductImage & {
  file?: File;
  previewUrl?: string;
};

type ProductImagesProps = {
  images: ImagePreview[];
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
};

export default function ProductImages({
  images,
  onAddImages,
  onRemoveImage,
}: ProductImagesProps) {
  return (
    <div>
      <span className="text-sm font-semibold">Imágenes</span>

      <input
        accept="image/*"
        className="form-input"
        multiple
        onChange={(event) => {
          onAddImages(event.target.files);
          event.target.value = "";
        }}
        type="file"
      />

      <div className="mt-3 grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div
            className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"
            key={`${image.url ?? image.previewUrl}-${index}`}
          >
            <img
              alt=""
              className="h-full w-full object-cover"
              src={image.previewUrl ?? image.url}
            />

            <button
              aria-label="Quitar imagen"
              className="absolute top-1 right-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white"
              onClick={() => onRemoveImage(index)}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
