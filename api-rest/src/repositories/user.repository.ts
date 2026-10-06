import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export interface IUserRepository {
  findByEmail(email: string): Promise<(typeof users.$inferSelect) | null>;
  findById(id: number): Promise<(typeof users.$inferSelect) | null>;
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<(typeof users.$inferSelect)>;
}

export class UserRepository implements IUserRepository {
  /**
   * Mencari user berdasarkan email (case-insensitive bisa dilakukan di service,
   * namun kita simpan apa adanya sesuai input tertrim)
   */
  async findByEmail(email: string): Promise<(typeof users.$inferSelect) | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }

  async findById(id: number): Promise<(typeof users.$inferSelect) | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }

  /**
   * Membuat user baru dan mengembalikan record lengkap
   */
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<(typeof users.$inferSelect)> {
    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
      })
      .returning();

    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  }
}