import { findHouseComponents } from "~~/lib/db/queries/house-component";
import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  return findHouseComponents(event.context.user.id);
});
