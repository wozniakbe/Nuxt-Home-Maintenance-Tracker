import { GetObjectCommand } from "@aws-sdk/client-s3";
import { insertMaintenanceLogImage } from "~~/lib/db/queries/maintenance-log-image";
import { InsertMaintenanceLogImage } from "~~/lib/db/schema";
import env from "~~/lib/env";
import createS3Client from "~~/server/utils/create-s3-client";

type ObjectMetadata = {
  "maintenance-log-id": string;
  "user-id": string;
};

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertMaintenanceLogImage.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  // calls endpoint internally and using event.$fetch ensures we retain context
  await event.$fetch(`/api/house-components/${slug}/${id}`);

  const s3 = createS3Client();
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: result.data.key,
  });

  const response = await s3.send(command);
  const metadata = response.Metadata as ObjectMetadata | undefined;

  if (!metadata || metadata["maintenance-log-id"] !== id || metadata["user-id"] !== event.context.user.id) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Image not found.",
    }));
  }

  const inserted = await insertMaintenanceLogImage(Number(id), result.data, event.context.user.id);

  return inserted;
});
