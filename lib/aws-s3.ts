import { env } from '@/lib/utils';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: env('AWS_S3_REGION'),
  credentials: {
    accessKeyId: env('AWS_S3_ACCESS_KEY_ID'),
    secretAccessKey: env('AWS_S3_SECRET_ACCESS_KEY'),
  },
});

export default s3;
