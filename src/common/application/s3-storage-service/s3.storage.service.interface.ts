import { Readable } from 'stream';

export interface IStorageS3Service {
  uploadFile(key: string, fileBuffer: Buffer, contentType: string): Promise<string>;
  getFile(key: string): Promise<string>;
}
