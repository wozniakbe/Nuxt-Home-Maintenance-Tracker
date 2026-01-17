import type { DrizzleError } from "drizzle-orm";

import { findHouseComponentByName, findUniqueSlug, insertHouseComponent } from "~~/lib/db/queries/house-component";
import { InsertHouseComponent } from "~~/lib/db/schema";
import slugify from "slug";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertHouseComponent.safeParse);

  console.info(result);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  console.info("not zod error");

  const existingComponent = await findHouseComponentByName(result.data, event.context.user.id);
  if (existingComponent) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A house component with that name already exists.",
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    console.info("inside of try");
    return await insertHouseComponent(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleError;
    const cause = error.cause as any;
    if (cause?.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: houseComponent.slug") {
      throw createError({
        statusCode: 409,
        statusMessage: "Slug must be unique (the item name is used to generate the slug).",
      });
    }
    console.info(error);
    throw error;
  }
});
