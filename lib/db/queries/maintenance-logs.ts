import type { InsertMaintenanceLog } from "../schema";

import db from "..";
import { maintenanceLog } from "../schema";

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
