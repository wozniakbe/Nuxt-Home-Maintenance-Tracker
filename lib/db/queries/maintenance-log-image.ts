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
