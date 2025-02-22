import { Injectable } from '@nestjs/common';
import { IdGenerator } from '../../application/id-generator/id-generator.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UuidGenerator implements IdGenerator<string> {
  async generateId(): Promise<string> {
    return uuidv4();
  }
}
