import * as assert from 'assert';
import { ProductImage } from 'src/product/domain/value-objects/product-image';
import { InvalidProductImageException } from 'src/product/domain/exceptions/invalid-product-image.exception';

describe('Product Image Invalid', () => {
  let caughtError: Error;

  beforeEach(() => {
    caughtError = null;
  });

  test('should not create a Product image', () => {
    try {
      ProductImage.create(`product/image.ts`);
    } catch (error) {
      caughtError = error;
    }
    assert.ok(caughtError instanceof InvalidProductImageException, `Expected InvalidProductImageException but got ${caughtError}`);
  });
});
