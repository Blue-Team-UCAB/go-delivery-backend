import { Product } from '../../../src/product/domain/product';
import { ProductId } from 'src/product/domain/value-objects/product.id';
import { ProductName } from 'src/product/domain/value-objects/product-name';
import { ProductDescription } from 'src/product/domain/value-objects/product-description';
import { ProductCurrency } from 'src/product/domain/value-objects/product-currency';
import { ProductPrice } from 'src/product/domain/value-objects/product-price';
import { ProductStock } from 'src/product/domain/value-objects/product-stock';
import { ProductWeight } from 'src/product/domain/value-objects/product-weight';
import { ProductMeasurement } from 'src/product/domain/value-objects/product-measurement';
import { ProductImage } from 'src/product/domain/value-objects/product-image';
import { ProductCategory } from 'src/product/domain/entities/product-category';
import { CategoryId } from 'src/category/domain/value-objects/category.id';
import { ProductCategoryName } from 'src/product/domain/value-objects/product-category-name';
import * as assert from 'assert';
import { InvalidProductIdException } from 'src/product/domain/exceptions/invalid-product-id.exception';

describe('Prodcut Domain', () => {
  let errorArrojado: Error;

  beforeEach(() => {
    errorArrojado = null;
  });

  test('Should not create a valid product because id is wrong', async () => {
    try {
      const product = new Product(
        ProductId.create('25414'),
        ProductName.create('Product Name'),
        ProductDescription.create('Product Description For Test'),
        ProductCurrency.create('USD'),
        ProductPrice.create(100),
        ProductStock.create(10),
        ProductWeight.create(1),
        ProductMeasurement.create('cm3'),
        ProductImage.create('products/image.jpg'),
        [new ProductCategory(CategoryId.create('b09eba42-852f-49af-8251-4d88af151fe5'), ProductCategoryName.create('Category Name'))],
      );
    } catch (err) {
      errorArrojado = err;
    }
    assert.ok(errorArrojado instanceof InvalidProductIdException, `Expected error to be an instance of InvalidProductIdException but got ${errorArrojado}`);
  });
});
