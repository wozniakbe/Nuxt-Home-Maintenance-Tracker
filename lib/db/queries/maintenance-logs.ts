import { and, eq } from "drizzle-orm";

import type { InsertMaintenanceLog } from "../schema";

import db from "..";
import { maintenanceLog } from "../schema";

export async function findMaintenanceLog(
  id: number,
  userId: string,
) {
  const foundLog = await db.query.maintenanceLog.findFirst({
    where: and(
      eq(maintenanceLog.id, id),
      eq(maintenanceLog.userId, userId),
    ),
  });

  return foundLog;
}

export async function insertMaintenanceLog(
  houseComponentId: number,
  insertable: InsertMaintenanceLog,
  userId: string,
) {
  const [inserted] = await db.insert(maintenanceLog).values({
    ...insertable,
    componentId: houseComponentId,
    userId,
  }).returning();

  return inserted;
}
