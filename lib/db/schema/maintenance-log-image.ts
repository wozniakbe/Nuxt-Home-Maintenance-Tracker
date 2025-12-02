import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
// import { user } from "./auth";
import { maintenanceLog } from "./maintenance-log";

export const maintenanceLogImage = sqliteTable("maintenanceLogImage", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  maintenanceId: int().notNull().references(() => maintenanceLog.id, { onDelete: "cascade" }),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
