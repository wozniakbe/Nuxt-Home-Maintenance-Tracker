import type { InsertHouseComponent } from "~~/lib/db/schema";

import { houseComponent } from "~~/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import db from "..";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export async function findHouseComponent(slug: string, userId: string) {
  return db.query.houseComponent.findFirst({
    where: and(eq(houseComponent.slug, slug), eq(houseComponent.userId, userId)),
    with: {
      maintenanceLogs: true,
    },
  });
}

export async function findHouseComponents(userId: string) {
  return db.query.houseComponent.findMany({
    where: eq(houseComponent.userId, userId),
  });
}

export async function findHouseComponentByName(existing: InsertHouseComponent, userId: string) {
  return db.query.houseComponent.findFirst({
    where: and(eq(houseComponent.name, existing.name), eq(houseComponent.userId, userId)),
  });
}

export async function findHouseComponentBySlug(slug: string) {
  return db.query.houseComponent.findFirst({
    where: eq(houseComponent.slug, slug),
  });
}

export async function findUniqueSlug(slug: string) {
  let existing = !!(await findHouseComponentBySlug(slug));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await findHouseComponentBySlug(idSlug));
    if (!existing) {
      return idSlug;
    }
  }
  return slug;
}

export async function insertHouseComponent(insertable: InsertHouseComponent, slug: string, userId: string) {
  const [created] = await db
    .insert(houseComponent)
    .values({ ...insertable, slug, userId })
    .returning();
  return created;
}
