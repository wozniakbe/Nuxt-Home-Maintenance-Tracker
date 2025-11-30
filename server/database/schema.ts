import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  githubId: integer("github_id").unique(),
  username: text("username"),
  avatarUrl: text("avatar_url"),
});

export const maintenanceItems = sqliteTable("maintenance_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").references(() => users.id), // Link to user
  name: text("name").notNull(), // e.g., "Change HVAC Filter"
  slug: text("slug").unique().notNull(), // for URLs
  frequencyDays: integer("frequency_days").notNull(), // e.g., 90
  lastCompleted: integer("last_completed", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});
