import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCustomerImageException } from '../exceptions/invalid-custumer-image.exception';

export class CustomerImage implements ValueObject<CustomerImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new InvalidCustomerImageException(`The URL ${url} is not valid.`);
    }
    this.url = url;
  }

  equals(url: CustomerImage): boolean {
    return this.url === url.url;
  }

  get Url(): string {
    return this.url;
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(\/?customer?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(url);
  }

  static create(url: string): CustomerImage {
    return new CustomerImage(url);
  }
}
