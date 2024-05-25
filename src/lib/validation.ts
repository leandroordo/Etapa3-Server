import { z } from "zod";

export const addProductSchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre no es válido",
      description: "Nombre del producto",
      required_error: "El nombre del producto es obligatorio",
    })
    .min(3, { message: "El nombre del producto es muy corto" })
    .max(100, { message: "El nombre del producto es muy largo" }),
  price: z.coerce
    .number({
      invalid_type_error: "El precio no es válido",
      description: "Precio del producto",
      required_error: "El precio del producto es obligatorio",
    })
    .gt(0, { message: "El precio del producto debe ser mayor a cero" })
    .lte(1000000, { message: "El precio del producto es muy grande" })
    .positive({ message: "El precio del producto no es correcto" }),
  stock: z.coerce
    .number({
      invalid_type_error: "El stock no es válido",
      description: "Stock del producto",
      required_error: "El stock del producto es obligatorio",
    })
    .gt(0, { message: "El stock del producto debe ser mayor a cero" })
    .lte(1000000, { message: "El stock del producto es muy grande" }),
  brand: z
    .string({
      invalid_type_error: "La marca no es válida",
      description: "Marca del producto",
      required_error: "La marca del producto es obligatorio",
    })
    .min(3, { message: "La marca del producto es muy corta" })
    .max(100, { message: "La marca del producto es muy larga" }),
  description: z
    .string({
      invalid_type_error: "La descripción no es válida",
      description: "Descripción del producto",
      required_error: "La descripción del producto es obligatoria",
    })
    .min(10, { message: "La descripción del producto es muy corta" })
    .max(255, { message: "La descripción del producto es muy larga" }),
  ageFrom: z.coerce
    .number({
      invalid_type_error: "La edad desde no es válida",
      description: "Edad desde del producto",
    })
    .gte(0, { message: "La edad desde debe ser cero o mayor a cero" })
    .lte(130, { message: "La edad desde es muy grande" }),
  ageTo: z.coerce
    .number({
      invalid_type_error: "La edad hasta no es válida",
      description: "Edad hasta del producto",
    })
    .gte(0, { message: "La edad hasta debe ser cero o mayor a cero" })
    .lte(130, { message: "La edad hasta es muy grande" }),
  photo: z
    .string({
      invalid_type_error: "La dirección URL de la foto no es válida",
      description: "URL de la foto del producto",
      required_error: "La dirección URL de la foto es obligatoria",
    })
    .min(8, { message: "La dirección URL de la foto es muy corta" })
    .max(255, { message: "LLa dirección URL de la foto es muy larga" })
    .url({ message: "La dirección URL de la foto no es válida" }),
});

export const updateProductSchema = z.object({
  name: z.optional(
    z
      .string({
        invalid_type_error: "El nombre no es válido",
        description: "Nombre del producto",
        required_error: "El nombre del producto es obligatorio",
      })
      .min(3, { message: "El nombre del producto es muy corto" })
      .max(100, { message: "El nombre del producto es muy largo" })
  ),
  price: z.optional(
    z.coerce
      .number({
        invalid_type_error: "El precio no es válido",
        description: "Precio del producto",
        required_error: "El precio del producto es obligatorio",
      })
      .gt(0, { message: "El precio del producto debe ser mayor a cero" })
      .lte(1000000, { message: "El precio del producto es muy grande" })
      .positive({ message: "El precio del producto no es correcto" })
  ),
  stock: z.optional(
    z.coerce
      .number({
        invalid_type_error: "El stock no es válido",
        description: "Stock del producto",
        required_error: "El stock del producto es obligatorio",
      })
      .gt(0, { message: "El stock del producto debe ser mayor a cero" })
      .lte(1000000, { message: "El stock del producto es muy grande" })
  ),
  brand: z.optional(
    z
      .string({
        invalid_type_error: "La marca no es válida",
        description: "Marca del producto",
        required_error: "La marca del producto es obligatorio",
      })
      .max(100, { message: "La marca del producto es muy larga" })
  ),
  description: z.optional(
    z
      .string({
        invalid_type_error: "La descripción no es válida",
        description: "Descripción del producto",
        required_error: "La descripción del producto es obligatoria",
      })
      .min(10, { message: "La descripción del producto es muy corta" })
      .max(255, { message: "La descripción del producto es muy larga" })
  ),
  ageFrom: z.optional(
    z.coerce
      .number({
        invalid_type_error: "La edad desde no es válida",
        description: "Edad desde del producto",
      })
      .gte(0, { message: "La edad desde debe ser cero o mayor a cero" })
      .lte(130, { message: "La edad desde es muy grande" })
  ),
  ageTo: z.optional(
    z.coerce
      .number({
        invalid_type_error: "La edad hasta no es válida",
        description: "Edad hasta del producto",
      })
      .gte(0, { message: "La edad hasta debe ser cero o mayor a cero" })
      .lte(130, { message: "La edad hasta es muy grande" })
  ),
  photo: z.optional(
    z
      .string({
        invalid_type_error: "La dirección URL de la foto no es válida",
        description: "URL de la foto del producto",
        required_error: "La dirección URL de la foto es obligatoria",
      })
      .min(8, { message: "La dirección URL de la foto es muy corta" })
      .max(255, { message: "LLa dirección URL de la foto es muy larga" })
      .url({ message: "La dirección URL de la foto no es válida" })
  ),
});

export const addContactMessageSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Escriba un nombre válido",
      description: "Su nombre",
      required_error: "No olvide escribir su nombre",
    })
    .min(3, { message: "Su nombre es muy corto" })
    .max(100, { message: "Escriba un nombre un poco más corto" }),

  email: z
    .string({
      invalid_type_error: "Escriba una dirección válida de e-mail",
      description: "Su dirección de e-mail",
      required_error: "No olvide escribir su dirección de e-mail",
    })
    .email({ message: "Esta dirección de e-mail no es válida" })
    .min(3, { message: "Su dirección de e-mail es muy corta" })
    .max(100, { message: "Escriba una dirección de e-mail un poco más corta" }),

  telephone: z
    .string({
      invalid_type_error: "Escriba un número de teléfono válido",
      description: "Su número de teléfono",
    })
    .max(100, { message: "Escriba un número de teléfono un poco más corto" }),
  message: z
    .string({
      invalid_type_error: "Escriba un mensaje válido",
      description: "Su mensaje o consulta",
    })
    .max(4000, { message: "Escriba un mensaje o consulta un poco más corto" }),
});

export const mongoObjedIdSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/, "El id no es un valor válido"),
});

export const addCartSchema = z.object({
  productId: z
    .string()
    .min(24, { message: "El id del producto es muy corto" })
    .max(24, { message: "El id del producto es muy largo" })
    .regex(/^[0-9a-f]{24}$/, "El id no es un valor válido"),
  quantity: z.coerce
    .number({
      invalid_type_error: "La cantidad no es válida",
      description: "Cantidad del producto",
    })
    .gte(0, { message: "La cantidad debe ser cero o mayor a cero" })
    .lte(50, { message: "La cantidad desde es muy grande" }),
});

export const updateProductInCartSchema = z.object({
  quantity: z.coerce
    .number({
      invalid_type_error: "La cantidad no es válida",
      description: "Cantidad del producto",
    })
    .gte(0, { message: "La cantidad debe ser cero o mayor a cero" })
    .lte(50, { message: "La cantidad desde es muy grande" }),
});
