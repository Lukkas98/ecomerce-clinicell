import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un String",
    })
    .max(200, "El nombre no debe exceder los 200 caracteres")
    .min(5, "El nombre es muy corto"),
  price: z
    .number({
      required_error: "El precio es requerido",
      invalid_type_error: "precio debe ser un número",
    })
    .min(1, "El precio no puede ser menor a 1"), // Ajusta según tus necesidades
  description: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser un String",
    })
    .max(1000, "La descripción no debe exceder los 1000 caracteres")
    .min(5, "La descripción es muy corta"),
  imagesSelected: z
    .array(z.string(), { invalid_type_error: "Images debe ser un Array" })
    .optional(),
  stock: z.boolean({
    required_error: "Stock es requerido",
    invalid_type_error: "Stock debe ser un Boleano",
  }),
  category: z
    .string({
      required_error: "La categoria es requerida",
      invalid_type_error: "La categoria debe ser un String",
    })
    .min(1, "La categoría es inválida"),
});