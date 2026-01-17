import type z from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import { maintenanceLog } from "./maintenance-log";

export const maintenanceLogImage = sqliteTable("maintenanceLogImage", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  maintenanceId: int().notNull().references(() => maintenanceLog.id, { onDelete: "cascade" }),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const maintenanceLogImageRelations = relations(maintenanceLogImage, ({ one }) => ({
  maintenanceLog: one(maintenanceLog, {
    fields: [maintenanceLogImage.maintenanceId],
    references: [maintenanceLog.id],
  }),
}));

export const InsertMaintenanceLogImage = createInsertSchema(maintenanceLogImage, {
  key: field => field.regex(/^[a-zA-Z0-9]+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key"),
}).omit({
  id: true,
  maintenanceId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMaintenanceLogImage = z.infer<typeof InsertMaintenanceLogImage>;
export type SelectMaintenanceLogImage = typeof maintenanceLogImage.$inferSelect;
