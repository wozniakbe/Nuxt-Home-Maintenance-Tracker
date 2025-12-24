import type { DrizzleError } from "drizzle-orm";

import db from "~~/lib/db";
import { houseComponent, InsertHouseComponent } from "~~/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

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

  const existingComponent = !!(await db.query.houseComponent.findFirst({
    where: and(eq(houseComponent.name, result.data.name), eq(houseComponent.userId, event.context.user.id)),
  }));
  if (existingComponent) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A house component with that name already exists.",
    }));
  }

  let slug = slugify(result.data.name);
  let existing = !!(await db.query.houseComponent.findFirst({
    where: eq(houseComponent.slug, slug),
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await db.query.houseComponent.findFirst({
      where: eq(houseComponent.slug, idSlug),
    }));
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db
      .insert(houseComponent)
      .values({ ...result.data, userId: event.context.user.id, slug })
      .returning();

    return created;
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
