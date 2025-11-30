import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const houseComponents = sqliteTable("houseComponents", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});
