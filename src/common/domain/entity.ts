import { ValueObject } from './value-object';

export class Entity<T extends ValueObject<T>> {
  protected constructor(private readonly id: T) {}

  get Id() {
    return this.id;
  }

  equals(id: T): boolean {
    return this.id.equals(id);
  }
}
