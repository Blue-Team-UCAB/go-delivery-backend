import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderProductImageException } from '../exceptions/invalid-order-product-image.exception';

export class OrderProductImage implements ValueObject<OrderProductImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new InvalidOrderProductImageException(`The URL ${url} is not valid.`);
    }
    this.url = url;
  }

  equals(url: OrderProductImage): boolean {
    return this.url === url.url;
  }

  get Url(): string {
    return this.url;
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(\/?products?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(url);
  }

  static create(url: string): OrderProductImage {
    return new OrderProductImage(url);
  }
}
