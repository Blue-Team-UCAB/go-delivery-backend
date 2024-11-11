import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { CreateProductServiceEntryDto } from '../dto/entry/create-product-service-entry.dto';
import { CreateProductServiceResponseDto } from '../dto/response/create-product-service-response.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { Product } from '../../domain/product';
import { ProductId } from '../../domain/value-objects/product.id';
import { ProductName } from '../../domain/value-objects/product-name';
import { ProductDescription } from '../../domain/value-objects/product-description';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { ProductImage } from '../../domain/value-objects/product-image';
import { ProductCurrency } from '../../domain/value-objects/product-currency';
import { ProductPrice } from '../../domain/value-objects/product-price';
import { ProductStock } from '../../domain/value-objects/product-stock';
import { ProductWeight } from '../../domain/value-objects/product-weight';
import { ProductCategory } from '../../domain/value-objects/product-category';

export class createProductApplicationService implements IApplicationService<CreateProductServiceEntryDto, CreateProductServiceResponseDto> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: CreateProductServiceEntryDto): Promise<Result<CreateProductServiceResponseDto>> {
    const imageKey = `products/${await this.idGenerator.generateId()}.jpg`;

    const imageUrl = await this.s3Service.uploadFile(imageKey, data.imageBuffer, data.contentType);

    const categories = data.categories.map(category => ProductCategory.create(category));

    const dataProduct = {
      name: ProductName.create(data.name),
      description: ProductDescription.create(data.description),
      currency: ProductCurrency.create(data.currency),
      price: ProductPrice.create(data.price),
      stock: ProductStock.create(data.stock),
      weight: ProductWeight.create(data.weight),
      imageUrl: ProductImage.create(imageUrl),
      categories: categories,
    };

    const product = new Product(
      ProductId.create(await this.idGenerator.generateId()),
      dataProduct.name,
      dataProduct.description,
      dataProduct.currency,
      dataProduct.price,
      dataProduct.stock,
      dataProduct.weight,
      dataProduct.imageUrl,
      dataProduct.categories,
    );
    const result = await this.productRepository.saveProductAggregate(product);

    if (!result.isSuccess()) {
      return Result.fail<CreateProductServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const imagenUlr = await this.s3Service.getFile(product.ImageUrl.Url);

    const response: CreateProductServiceResponseDto = {
      id: product.Id.Id,
      name: product.Name.Name,
      description: product.Description.Description,
      currency: product.Currency.Currency,
      price: product.Price.Price,
      stock: product.Stock.Stock,
      weight: product.Weight.Weight,
      imageUrl: imagenUlr,
      categories: product.Categories.map(category => category.Category),
    };

    return Result.success<CreateProductServiceResponseDto>(response, 200);
  }
}
