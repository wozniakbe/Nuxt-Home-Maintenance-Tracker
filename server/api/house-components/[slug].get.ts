import { findHouseComponent } from "~~/lib/db/queries/house-component";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const houseComponent = await findHouseComponent(slug, event.context.user.id);

  if (!houseComponent) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "House component not found.",
    }));
  }
  return houseComponent;
});
