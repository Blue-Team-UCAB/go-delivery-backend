import { ValueObject } from '../../../common/domain/value-object';
import { InvalidProductImageException } from '../exceptions/invalid-product-image.exception';

export class ProductImage implements ValueObject<ProductImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new InvalidProductImageException(`The URL ${url} is not valid.`);
    }
    this.url = url;
  }

  equals(url: ProductImage): boolean {
    return this.url === url.url;
  }

  get Url(): string {
    return this.url;
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(\/?products?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(url);
  }

  static create(url: string): ProductImage {
    return new ProductImage(url);
  }
}
