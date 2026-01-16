import { findHouseComponent } from "~~/lib/db/queries/house-component";
import { deleteMaintenanceLog } from "~~/lib/db/queries/maintenance-logs";
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
  const deletedLog = await deleteMaintenanceLog(Number(id), event.context.user.id);

  if (!deletedLog) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Maintenance log not found.",
    }));
  }

  setResponseStatus(event, 204);
});
