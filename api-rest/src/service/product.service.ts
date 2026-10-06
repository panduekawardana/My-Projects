import { db } from "../db/index.js";
import { products } from "../db/schema.js";
import type { CreateProductInput } from "../validation/product.schema.js";

export async function createProduct(
  data: CreateProductInput,
  userId: number,
) {
  const [product] = await db.insert(products).values({
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    userId,
  }).returning();

  return product;
}