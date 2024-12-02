import { ValueObject } from '../../../common/domain/value-object';
import { InvalidOrderBundleImageException } from '../exceptions/invalid-order-bundle-image.exception';

export class OrderBundleImage implements ValueObject<OrderBundleImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new InvalidOrderBundleImageException(`The URL ${url} is not valid.`);
    }
    this.url = url;
  }

  equals(url: OrderBundleImage): boolean {
    return this.url === url.url;
  }

  get Url(): string {
    return this.url;
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(\/?bundles?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(url);
  }

  static create(url: string): OrderBundleImage {
    return new OrderBundleImage(url);
  }
}
