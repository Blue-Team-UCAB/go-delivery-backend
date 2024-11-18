import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';

@Injectable()
export class CodeVerificationService implements IdGenerator<string> {
  async generateId(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 6;

    return Array.from(crypto.randomBytes(length))
      .map(byte => characters[byte % characters.length])
      .join('');
  }
}
