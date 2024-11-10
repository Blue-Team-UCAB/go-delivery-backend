import { ValueObject } from 'src/common/domain/value-object';
import { InvalidProductImageException } from '../exceptions/invalid-product-image.exception';

export class ProductImage implements ValueObject<ProductImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrlOrPath(url)) {
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

  private isValidUrlOrPath(url: string): boolean {
    return this.isAbsoluteUrl(url) || this.isRelativePath(url);
  }

  private isAbsoluteUrl(url: string): boolean {
    const regex = new RegExp(/^(http(s?):\/\/)([/|.|\w|\s|-])*\.(jpg|jpeg|gif|png)$/i);
    return regex.test(url);
  }

  private isRelativePath(path: string): boolean {
    const regex = new RegExp(/^(\/?products?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(path);
  }

  static create(url: string): ProductImage {
    return new ProductImage(url);
  }
}
