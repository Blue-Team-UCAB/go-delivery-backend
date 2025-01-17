import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';

export class IdGeneratorMock implements IdGenerator<string> {
  generateId(): Promise<string> {
    return Promise.resolve('e425c9d8-2045-4de1-9c41-ce599eda0221');
  }
}
