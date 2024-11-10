import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetProductPageServiceEntryDto } from '../dto/entry/get-product-page-service-entry.dto';
import { GetProductPageServiceResponseDto } from '../dto/response/get-product-page-service-responde.dto';
import { Result } from 'src/common/Domain/result-handler/Result';
import { IProductRepository } from 'src/product/domain/repositories/product-repository.interface';
import { Product } from 'src/product/domain/product';
import { IStorageS3Service } from 'src/common/application/s3-storage-service/s3.storage.service.interface';

export class GetProductByPageApplicationService implements IApplicationService<GetProductPageServiceEntryDto, GetProductPageServiceResponseDto> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: GetProductPageServiceEntryDto): Promise<Result<GetProductPageServiceResponseDto>> {
    const productResult: Result<Product[]> = await this.productRepository.findAllProducts(data.page, data.take);

    if (!productResult.isSuccess) {
      return Result.fail(productResult.Error, productResult.StatusCode, productResult.Message);
    }

    const productsWithImages = await Promise.all(
      productResult.Value.map(async product => {
        const imageUrl: string = await this.s3Service.getFile(product.ImageUrl.Url);
        return {
          id: product.Id.Id,
          name: product.Name.Name,
          description: product.Description.Description,
          imagenUrl: imageUrl,
        };
      }),
    );

    const response: GetProductPageServiceResponseDto = {
      products: productsWithImages,
    };

    return Result.success(response, 200);
  }
}
