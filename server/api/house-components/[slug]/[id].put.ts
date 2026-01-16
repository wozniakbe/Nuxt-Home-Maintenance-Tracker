import { findHouseComponent } from "~~/lib/db/queries/house-component";
import { updateMaintenanceLog } from "~~/lib/db/queries/maintenance-logs";
import { InsertMaintenanceLog } from "~~/lib/db/schema";
import z from "zod";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;

  const result = await readValidatedBody(event, InsertMaintenanceLog.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const houseComponent = await findHouseComponent(slug, event.context.user.id);

  if (!houseComponent) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "House component not found.",
    }));
  }

  const id = getRouterParam(event, "id") as string;

  if (!z.coerce.number().safeParse(id).success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid id.",
    }));
  }
  const maintenanceLog = await updateMaintenanceLog(Number(id), result.data, event.context.user.id);

  if (!maintenanceLog) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Maintenance log not found.",
    }));
  }

  return maintenanceLog;
});
