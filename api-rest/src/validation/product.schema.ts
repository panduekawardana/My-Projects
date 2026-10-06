import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi").max(255, "Nama produk maximal 255 karakter"),

  description: z.string().trim().max(1000, "Batas deskripsi 1000 kata").optional(),
  
  price: z.number().int("Harga harus bilangan bulat").nonnegative("Harga tidak boleh negatif"),
  
  stock: z.number().int("Stock harus bilangan bulat").nonnegative("Stock tidak "),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length < 0, {
      message: "Minimal satu field harus diubah"
    }
  )

export const productIdSchema = z.object({
  id: z.coerce.number().int("ID harus berupa bilangan bulat").positive("ID harus lebih besar daripada nol")
});

// Infer
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
