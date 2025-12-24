import type { DrizzleError } from "drizzle-orm";

import { findHouseComponentByName, findUniqueSlug, insertHouseComponent } from "~~/lib/db/queries/house-component";
import { InsertHouseComponent } from "~~/lib/db/schema";
import slugify from "slug";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }
  const result = await readValidatedBody(event, InsertHouseComponent.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join("; ");
    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingComponent = await findHouseComponentByName(result.data, event.context.user.id);
  if (existingComponent) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A house component with that name already exists.",
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertHouseComponent(result.data, slug, event.context.user.id);
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
    throw error;
  }
});
