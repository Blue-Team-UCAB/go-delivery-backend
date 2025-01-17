export class Result<T> {
  private value?: T;
  private error?: Error;
  private errorCode?: number;
  private message?: string;
  private is_success: boolean;

  private constructor(value: T, error: Error, errorCode: number, message: string, is_success: boolean) {
    this.error = error;
    this.errorCode = errorCode;
    this.value = value;
    this.message = message;
    this.is_success = is_success;
  }

  isSuccess(): boolean {
    return this.is_success;
  }

  get Value(): T {
    if (this.isSuccess) return this.value;
    throw new Error('The value does not exists');
  }

  get Error(): Error {
    if (this.error) return this.error;
    throw new Error('The error does not exists');
  }

  get StatusCode(): number {
    return this.errorCode;
  }

  get Message(): string {
    if (this.message) return this.message;
    throw new Error('The message does not exists');
  }

  static success<T>(value: T, statusCode: number): Result<T> {
    return new Result(value, null, statusCode, null, true);
  }

  static fail<T>(error: Error, errorCode: number, message: string): Result<T> {
    return new Result(null, error, errorCode, message, false);
  }
}
