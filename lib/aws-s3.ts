import { env } from '@/lib/utils';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';

const getClient = () =>
  new S3Client({
    region: env('AWS_S3_REGION'),
    credentials: {
      accessKeyId: env('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_S3_SECRET_ACCESS_KEY'),
    },
  });

export const upload = async (
  key: string,
  body: StreamingBlobPayloadInputTypes,
  contentType: string,
) => {
  const client = getClient();
  const bucket = env('AWS_S3_BUCKET');

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return `https://${bucket}.s3.amazonaws.com/${key}`;
};
