import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string({ required_error: "El nombre es obligatorio" })
      .trim()
      .min(4, "El nombre es muy corto")
      .max(200, "El nombre es muy largo"),

    description: z
      .string({ required_error: "La descripción es obligatoria" })
      .trim()
      .min(10, "La descripción es muy corta"),

    price: z.coerce
      .number({ invalid_type_error: "El precio es obligatorio" })
      .positive("El precio debe ser mayor a 0"),

    stock: z.coerce
      .number({ invalid_type_error: "El stock es obligatorio" })
      .min(0, "El stock no puede ser negativo"),

    categories: z.array(z.string().optional()),

    discountOffert: z.boolean().optional(),

    discountOutlet: z.boolean().optional(),

    discountPrice: z.coerce
      .number()
      .positive("El precio de descuento debe ser mayor a 0")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Oferta y outlet no pueden estar activos al mismo tiempo
    if (data.discountOffert && data.discountOutlet) {
      ctx.addIssue({
        code: "custom",
        path: ["discountOffert"],
        message: "No puedes activar oferta y outlet al mismo tiempo",
      });
    }

    // Si hay algún descuento activo, debe existir precio de descuento
    if (
      (data.discountOffert || data.discountOutlet) &&
      data.discountPrice === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: "Debes indicar un precio de descuento",
      });
    }

    // El descuento debe ser menor al precio original
    if (data.discountPrice !== undefined && data.discountPrice >= data.price) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: `El precio de descuento debe ser menor al precio original de $${data.price}`,
      });
    }
  });

export type ProductFormValues = z.infer<typeof productSchema>;

export type ProductFormField = keyof ProductFormValues;

export function validateProductField(field: ProductFormField, value: unknown) {
  const result = productSchema._def.schema.shape[field].safeParse(value);

  return result.success
    ? null
    : (result.error.issues[0]?.message ?? "Valor inválido");
}

export function validateProductForm(
  values: Partial<Record<ProductFormField, unknown>>,
) {
  const result = productSchema.safeParse(values);

  if (result.success) {
    return {
      ok: true as const,
      errors: {},
    };
  }

  const errors: Partial<Record<ProductFormField, string>> = {};

  for (const issue of result.error.issues) {
    const key = issue.path[0] as ProductFormField;

    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return {
    ok: false as const,
    errors,
  };
}
