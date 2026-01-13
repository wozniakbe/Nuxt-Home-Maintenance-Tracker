import { findHouseComponents } from "~~/lib/db/queries/house-component";

export default defineAuthenticatedEventHandler(async (event) => {
  // promise below for latency testing
  // await new Promise(resolve => setTimeout(resolve, 2000));
  return findHouseComponents(event.context.user.id);
});
