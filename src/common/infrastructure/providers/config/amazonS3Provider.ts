import { S3Client } from '@aws-sdk/client-s3';

export const s3Provider = [
  {
    provide: 'S3_BUCKET',
    useFactory: async () => {
      const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      return {
        client: s3,
        bucketName: process.env.AWS_S3_BUCKET_NAME as string,
      };
    },
  },
];
