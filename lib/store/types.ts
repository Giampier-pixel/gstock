import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'El nombre es obligatorio'),
  stock: z.coerce.number().int().nonnegative('El stock no puede ser negativo'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  value: z.string().min(1, 'El valor es obligatorio'),
});
export const productCreateSchema = productSchema.omit({ id: true });
export const productUpdateSchema = productCreateSchema.partial().extend({ id: z.string() });
export type Product = z.infer<typeof productSchema>;

export const movementTypeSchema = z.enum(['Entrada', 'Salida', 'Ajuste']);
export const movementSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  type: movementTypeSchema,
  product: z.string().min(1, 'El producto es obligatorio'),
  quantity: z.coerce.number().int(),
  user: z.string().min(1),
});
export const movementCreateSchema = movementSchema.omit({ id: true, date: true, user: true });
export type Movement = z.infer<typeof movementSchema>;
export type MovementType = z.infer<typeof movementTypeSchema>;

export const providerStatusSchema = z.enum(['Activo', 'Inactivo']);
export const providerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'El nombre es obligatorio'),
  contact: z.string().min(1, 'El contacto es obligatorio'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  status: providerStatusSchema,
});
export const providerCreateSchema = providerSchema.omit({ id: true });
export const providerUpdateSchema = providerCreateSchema.partial().extend({ id: z.string() });
export type Provider = z.infer<typeof providerSchema>;
export type ProviderStatus = z.infer<typeof providerStatusSchema>;
