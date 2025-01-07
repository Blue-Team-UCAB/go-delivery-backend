import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderCourierImageException } from '../exceptions/invalid-order-courier-image.exception';

export class OrderCourierImage implements ValueObject<OrderCourierImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new InvalidOrderCourierImageException(`The URL ${url} is not valid.`);
    }
    this.url = url;
  }

  equals(url: OrderCourierImage): boolean {
    return this.url === url.url;
  }

  get Url(): string {
    return this.url;
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(\/?courier?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(url);
  }

  static create(url: string): OrderCourierImage {
    return new OrderCourierImage(url);
  }
}
