import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { deleteMaintenanceLogImage } from "~~/lib/db/queries/maintenance-log-image";
import env from "~~/lib/env";
import { z } from "zod";

export default defineAuthenticatedEventHandler(async (event) => {
  const imageId = getRouterParam(event, "image-id") as string;

  if (!z.coerce.number().safeParse(imageId).success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid image id.",
    }));
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  await event.$fetch(`/api/house-components/${slug}/${id}`);

  const deleted = await deleteMaintenanceLogImage(Number(imageId), event.context.user.id);

  if (deleted) {
    // TODO: need to cascade this delete logic to other delete endpoints
    // or set up a cron job to check for orphaned files
    const client = createS3Client();
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: deleted.key,
    });

    await client.send(command);
  }

  setResponseStatus(event, 204);
});
