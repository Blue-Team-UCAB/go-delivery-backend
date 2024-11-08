import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductIdException } from '../exeptions/invalid-product-id.exeption';

export class ProductId implements ValueObject<ProductId> {
  private readonly id: string;

  constructor(id: string) {
    const regex = new RegExp(
      '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    );
    if (!regex.test(id))
      throw new InvalidProductIdException(`ID ${id} is not valid`);
    this.id = id;
  }

  equals(obj: ProductId): boolean {
    return this.id === obj.id;
  }

  getId(): string {
    return this.id;
  }

  static create(id: string): ProductId {
    return new ProductId(id);
  }
}
