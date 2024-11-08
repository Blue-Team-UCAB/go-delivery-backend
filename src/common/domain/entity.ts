import { ValueObject } from './value-object';

export class Entity<T extends ValueObject<T>> {
  private readonly id: T;

  protected constructor(id: T) {
    this.id = id;
  }

  get Id() {
    return this.id;
  }

  equals(id: T): boolean {
    return this.id.equals(id);
  }
}
