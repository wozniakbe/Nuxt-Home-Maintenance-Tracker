import { and, eq } from "drizzle-orm";

import type { InsertMaintenanceLogImage } from "../schema";

import db from "..";
import { maintenanceLogImage } from "../schema";

export async function insertMaintenanceLogImage(
  id: number,
  data: InsertMaintenanceLogImage,
  userId: string,
) {
  const [inserted] = await db.insert(maintenanceLogImage).values({
    ...data,
    maintenanceId: id,
    userId,
  }).returning();

  return inserted;
}

export async function deleteMaintenanceLogImage(
  id: number,
  userId: string,
) {
  const deleted = await db.delete(maintenanceLogImage).where(
    and(eq(maintenanceLogImage.id, id), eq(maintenanceLogImage.userId, userId)),
  ).returning();

  return deleted[0];
}
