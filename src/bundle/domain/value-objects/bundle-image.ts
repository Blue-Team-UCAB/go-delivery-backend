import { ValueObject } from '../../../common/domain/value-object';
import { InvalidBundleImageException } from '../exceptions/invalid-bundle-image.exception';

export class BundleImage implements ValueObject<BundleImage> {
  private readonly url: string;

  constructor(url: string) {
    if (!this.isValidUrl(url)) {
      throw new InvalidBundleImageException(`The URL ${url} is not valid.`);
    }
    this.url = url;
  }

  equals(url: BundleImage): boolean {
    return this.url === url.url;
  }

  get Url(): string {
    return this.url;
  }

  private isValidUrl(url: string): boolean {
    const regex = new RegExp(/^(\/?bundles?\/[a-zA-Z0-9_-]+\.(jpg|jpeg|gif|png))$/i);
    return regex.test(url);
  }

  static create(url: string): BundleImage {
    return new BundleImage(url);
  }
}
