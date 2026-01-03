import { findHouseComponentByName, updateHouseComponentBySlug } from "~~/lib/db/queries/house-component";
import { InsertHouseComponent } from "~~/lib/db/schema";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";
import sendZodError from "~~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const result = await readValidatedBody(event, InsertHouseComponent.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const existingHouseComponent = await findHouseComponentByName(result.data, event.context.user.id);

  if (existingHouseComponent && existingHouseComponent.slug !== slug) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A house component with that name already exists!",
    }));
  }

  return updateHouseComponentBySlug(result.data, slug, event.context.user.id);
});
