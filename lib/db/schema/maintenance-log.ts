import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";

import { DescriptionSchema, NameSchema } from "../zod-schemas";
import { user } from "./auth";
import { houseComponent } from "./house-component";

export const maintenanceLog = sqliteTable("maintenanceLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
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

export const InsertMaintenanceLog = createInsertSchema(maintenanceLog, {
  name: NameSchema,
  description: DescriptionSchema,
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  componentId: true,
}).superRefine((values, context) => {
  if (values.endedAt && (values.endedAt < values.startedAt || values.startedAt > values.endedAt)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start Date must be before End Date",
      path: ["startedAt"],
    });
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End Date must be after Start Date",
      path: ["endedAt"],
    });
  }
});

export type InsertMaintenanceLog = z.infer<typeof InsertMaintenanceLog>;
export type SelectMaintenanceLog = typeof maintenanceLog.$inferSelect;
