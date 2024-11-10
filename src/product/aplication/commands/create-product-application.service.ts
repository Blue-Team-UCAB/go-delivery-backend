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

export class createProductApplicationService implements IApplicationService<CreateProductServiceEntryDto, CreateProductServiceResponseDto> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: CreateProductServiceEntryDto): Promise<Result<CreateProductServiceResponseDto>> {
    const imageKey = `products/${await this.idGenerator.generateId()}.jpg`;

    const imageUrl = await this.s3Service.uploadFile(imageKey, data.imageBuffer, data.contentType);

    const dataProduct = {
      name: ProductName.create(data.name),
      description: ProductDescription.create(data.description),
      imageUrl: ProductImage.create(imageUrl),
    };

    const product = new Product(ProductId.create(await this.idGenerator.generateId()), dataProduct.name, dataProduct.description, dataProduct.imageUrl);
    const result = await this.productRepository.saveProductAggregate(product);

    if (!result.isSuccess()) {
      return Result.fail<CreateProductServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const imagenUlr = await this.s3Service.getFile(product.ImageUrl.Url);

    const response: CreateProductServiceResponseDto = {
      id: product.Id.Id,
      name: product.Name.Name,
      description: product.Description.Description,
      imageUrl: imagenUlr,
    };

    return Result.success<CreateProductServiceResponseDto>(response, 200);
  }
}
