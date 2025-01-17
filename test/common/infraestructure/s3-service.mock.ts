import { IStorageS3Service } from 'src/common/application/s3-storage-service/s3.storage.service.interface';

export class S3ServiceMock implements IStorageS3Service {
  async uploadFile(key: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    return 'category/image.jpg';
  }
  async getFile(key: string): Promise<string> {
    return 'https://godely.s3.us-east-1.amazonaws.com/logoGodely.jpg';
  }
}
