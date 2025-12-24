import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";

export const houseComponent = sqliteTable("houseComponent", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  floor: int().notNull(),
  room: text().notNull(),
  userId: text().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

export const InsertHouseComponent = createInsertSchema(houseComponent, {
  name: field => field.min(1).max(100),
  description: field => field.max(1000),
  floor: field => field.min(0).max(2),
  room: field => field.min(0).max(100),
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
