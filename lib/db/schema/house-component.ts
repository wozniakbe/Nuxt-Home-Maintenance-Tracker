import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

export const houseComponent = sqliteTable("houseComponent", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  floor: int().notNull(),
  room: text().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
