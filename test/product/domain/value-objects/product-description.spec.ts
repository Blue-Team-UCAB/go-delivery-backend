import * as assert from 'assert';
import { ProductDescription } from 'src/product/domain/value-objects/product-description';
import { InvalidProductDescriptionException } from 'src/product/domain/exceptions/invalid-product-description.exception';

describe('Product Description Invalid', () => {
  let caughtError: Error;

  beforeEach(() => {
    caughtError = null;
  });

  test('should not create a Product image with invalid image', () => {
    try {
      ProductDescription.create(`hola`);
    } catch (error) {
      caughtError = error;
    }
    assert.ok(caughtError instanceof InvalidProductDescriptionException, `Expected InvalidProductImageException but got ${caughtError}`);
  });
});
