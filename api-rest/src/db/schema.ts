import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  userId: serial("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
})