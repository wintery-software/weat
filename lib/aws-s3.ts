import { env } from '@/lib/utils';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';

export const getClient = () =>
  new S3Client({
    region: env('AWS_REGION'),
    credentials: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
    },
  });

export const upload = async (
  key: string,
  body: StreamingBlobPayloadInputTypes,
  contentType: string,
) => {
  const client = getClient();
  const bucket = env('AWS_BUCKET');

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

export const getS3PlacePhotoUrl = (
  placeId: string,
  photoReference: string,
  placeholderSize: number | string = 256,
) => {
  // Save money in development
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_AWS_S3_ENABLED_DEV !== 'true'
  ) {
    return `https://via.placeholder.com/${placeholderSize}`;
  }

  return `https://wintery-software-weat.s3.amazonaws.com/google-maps/${placeId}/${photoReference}.jpg`;
};
