import defineAuthenticatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async () => {
  // we should not be getting here but having issues where the nested parent
  // /dashboard page is making calls to the house-components endpoint as
  // "undefined" so we'll send it here instead. eventually want to add logging
  // to this file so we can just keep track of this bug until we figure out how
  // to fix it
  return { maintenanceLogs: [] };
});
