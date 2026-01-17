import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import type { SelectMaintenanceLog } from "./maintenance-log";

import { DescriptionSchema, FloorSchema, NameSchema, RoomSchema } from "../zod-schemas";
import { user } from "./auth";
import { maintenanceLog } from "./maintenance-log";

export const houseComponent = sqliteTable("houseComponent", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  floor: int().notNull(),
  room: text().notNull(),
  userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId),
]);

export const houseComponentRelations = relations(houseComponent, ({ many }) => ({
  maintenanceLogs: many(maintenanceLog),
}));

export const InsertHouseComponent = createInsertSchema(houseComponent, {
  name: NameSchema,
  description: DescriptionSchema,
  floor: FloorSchema,
  room: RoomSchema,
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHouseComponent = z.infer<typeof InsertHouseComponent>;
export type SelectHouseComponent = typeof houseComponent.$inferSelect;
export type SelectHouseComponentWithLogs = SelectHouseComponent & {
  maintenanceLogs: SelectMaintenanceLog[];
};
