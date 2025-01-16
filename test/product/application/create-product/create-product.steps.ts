import * as assert from 'assert';
import { createProductApplicationService } from 'src/product/application/commands/create-product-application.service';
import { ProductRepositoryMock } from 'test/product/infraestructure/product-repository.mock';
import { CategoryRepositoryMock } from 'test/category/category-repository.mock';
import { IdGeneratorMock } from 'test/common/infraestructure/id-Generato.mock';
import { S3ServiceMock } from 'test/common/infraestructure/s3-service.mock';
import { PublisherMock } from 'test/common/infraestructure/publisher.mock';
import { When, Then } from '@cucumber/cucumber';
import { Category } from 'src/category/domain/category';
import { CategoryId } from 'src/category/domain/value-objects/category.id';
import { CategoryName } from 'src/category/domain/value-objects/category-name';
import { CategoryImage } from 'src/category/domain/value-objects/category-image';

let errorArrojado: any;
When('Tratando de Crear Producto Valido', async () => {
  try {
    const categories = new CategoryRepositoryMock();
    categories.saveCategoryAggregate(new Category(CategoryId.create('b09eba42-852f-49af-8251-4d88af151fe5'), CategoryName.create('Category Name'), CategoryImage.create('categories/45451.jpg')));

    let service = new createProductApplicationService(new ProductRepositoryMock(), categories, new IdGeneratorMock(), new S3ServiceMock(), new PublisherMock());

    const resp = await service.execute({
      name: 'Product Name',
      description: 'Product Description For Test',
      currency: 'USD',
      price: 100,
      stock: 1,
      weight: 0.1,
      measurement: 'cm3',
      imageBuffer: Buffer.from('505'),
      contentType: 'string',
      categories: ['b09eba42-852f-49af-8251-4d88af151fe5'],
    });

    if (!resp.isSuccess()) errorArrojado = resp.Error;
  } catch (err) {
    errorArrojado = err;
  }
});

Then('Se creo el producto Correctamente', async () => {
  assert.ok(errorArrojado === undefined, `Se esperaba que se creara el producto correctamente, pero se obtuvo el error: ${errorArrojado}`);
});
