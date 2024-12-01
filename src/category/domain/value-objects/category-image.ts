import { ValueObject } from '../../../common/domain/value-object';
import { InvalidCategoryImageException } from '../exceptions/invalid-category-image.exception';

export class CategoryImage implements ValueObject<CategoryImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new InvalidCategoryImageException(`The URL ${url} is not valid.`);
    }
    this.url = url;
  }

  equals(url: CategoryImage): boolean {
    return this.url === url.url;
  }

  get Url(): string {
    return this.url;
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(\/?categories?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(url);
  }

  static create(url: string): CategoryImage {
    return new CategoryImage(url);
  }
}
