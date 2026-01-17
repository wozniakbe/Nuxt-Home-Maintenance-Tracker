import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import env from "~~/lib/env";
import createS3Client from "~~/server/utils/create-s3-client";
import { z } from "zod";

const MAX_CONTENT_LENGTH = 1024 * 1024;

const ImageSchema = z.object({
  contentLength: z.number().min(1).max(MAX_CONTENT_LENGTH),
  checksum: z.string(),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, ImageSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  // calls endpoint internally and using event.$fetch ensures we retain context
  await event.$fetch(`/api/house-components/${slug}/${id}`);

  // ready to create signed URL
  const s3 = createS3Client();

  const fileName = crypto.randomUUID();
  const key = `${event.context.user.id}/${id}/${fileName}.jpg`;

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: env.S3_BUCKET,
    Key: key,
    Expires: 120,
    Fields: {
      "x-amz-checksum-sha-256": result.data.checksum,
    },
    Conditions: [
      ["content-length-range", result.data.contentLength, result.data.contentLength],
      ["eq", "$x-amz-meta-user-id", event.context.user.id],
      ["eq", "$x-amz-meta-maintenance-log-id", id],
    ],
  });

  fields["x-amz-meta-user-id"] = event.context.user.id;
  fields["x-amz-meta-maintenance-log-id"] = id;

  return { url, fields, key };
});
