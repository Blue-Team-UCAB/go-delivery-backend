import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetProductIdServiceResponseDto } from '../dto/response/get-product-id-service.response.dto';
import { GetProductIdServiceEntryDto } from '../dto/entry/get-product-id-service.entry.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/product';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';

export class GetProductByIdApplicationService implements IApplicationService<GetProductIdServiceEntryDto, GetProductIdServiceResponseDto> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: GetProductIdServiceEntryDto): Promise<Result<GetProductIdServiceResponseDto>> {
    const productResult: Result<Product> = await this.productRepository.findProductById(data.id);

    if (!productResult.isSuccess) {
      return Result.fail(productResult.Error, productResult.StatusCode, productResult.Message);
    }

    const imageUrl: string = await this.s3Service.getFile(productResult.Value.ImageUrl.Url);

    const response: GetProductIdServiceResponseDto = {
      id: productResult.Value.Id.Id,
      name: productResult.Value.Name.Name,
      description: productResult.Value.Description.Description,
      currency: productResult.Value.Currency.Currency,
      price: productResult.Value.Price.Price,
      stock: productResult.Value.Stock.Stock,
      weight: productResult.Value.Weight.Weight,
      imagenUrl: imageUrl,
    };

    return Result.success(response, 200);
  }
}
