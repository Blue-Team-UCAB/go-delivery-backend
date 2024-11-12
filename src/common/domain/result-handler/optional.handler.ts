export class Optional<T> {
  private value: T | undefined;
  private assigned: boolean;

  constructor(value?: T) {
    this.value = value;
    this.assigned = value !== undefined && value !== null;
  }

  getValue(): T {
    if (!this.assigned) {
      throw new Error('undifined');
    }
    return <T>this.value;
  }

  getAssigned(): boolean {
    return this.assigned;
  }
}
