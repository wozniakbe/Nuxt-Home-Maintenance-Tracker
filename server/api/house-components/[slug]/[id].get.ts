import { findHouseComponent } from "~~/lib/db/queries/house-component";
import { findMaintenanceLog } from "~~/lib/db/queries/maintenance-logs";
import z from "zod";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
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
  const maintenanceLog = await findMaintenanceLog(Number(id), event.context.user.id);

  if (!maintenanceLog) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Maintenance log not found.",
    }));
  }

  return maintenanceLog;
});
