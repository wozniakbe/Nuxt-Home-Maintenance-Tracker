import { findHouseComponent } from "~~/lib/db/queries/house-component";
import { insertMaintenanceLog } from "~~/lib/db/queries/maintenance-logs";
import { InsertMaintenanceLog } from "~~/lib/db/schema";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const houseComponent = await findHouseComponent(slug, event.context.user.id);

  if (!houseComponent) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "House component not found.",
    }));
  }

  const result = await readValidatedBody(event, InsertMaintenanceLog.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  return insertMaintenanceLog(houseComponent.id, result.data, event.context.user.id);
});
