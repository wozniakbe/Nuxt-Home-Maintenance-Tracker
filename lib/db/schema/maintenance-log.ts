import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { houseComponent } from "./house-component";

export const maintenanceLog = sqliteTable("maintenanceLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int(),
  endedAt: int(),
  componentId: int().notNull().references(() => houseComponent.id, { onDelete: "cascade" }),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const maintenanceLogRelations = relations(maintenanceLog, ({ one }) => ({
  component: one(houseComponent, {
    fields: [maintenanceLog.componentId],
    references: [houseComponent.id],
  }),
}));

export type SelectMaintenanceLog = typeof maintenanceLog.$inferSelect;
