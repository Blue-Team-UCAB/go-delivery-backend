import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { IStorageS3Service } from 'src/common/application/s3-storage-service/s3.storage.service.interface';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service implements IStorageS3Service {
  constructor(
    @Inject('S3_BUCKET')
    private readonly s3Provider: { client: S3Client; bucketName: string },
  ) {}

  async uploadFile(key: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.s3Provider.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await this.s3Provider.client.send(command);
    return key;
  }

  async getFile(key: string): Promise<string> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.s3Provider.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Provider.client, getObjectCommand, { expiresIn: 3600 });
    return url;
  }
}
