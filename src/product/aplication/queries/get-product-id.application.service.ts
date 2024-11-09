import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetProductIdServiceResponseDto } from '../dto/response/get-product-id-service.response.dto';
import { GetProductIdServiceEntryDto } from '../dto/entry/get-product-id-service.entry.dto';
import { Result } from 'src/common/Domain/result-handler/Result';
import { IProductRepository } from 'src/product/domain/repositories/product-repository.interface';
import { Product } from 'src/product/domain/product';

export class GetProductByIdApplicationService implements IApplicationService<GetProductIdServiceEntryDto, GetProductIdServiceResponseDto> {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: GetProductIdServiceEntryDto): Promise<Result<GetProductIdServiceResponseDto>> {
    const productResult: Result<Product> = await this.productRepository.findProductById(data.id);

    if (!productResult.isSuccess) {
      return Result.fail(productResult.Error, productResult.StatusCode, productResult.Message);
    }

    const response: GetProductIdServiceResponseDto = {
      id: productResult.Value.Id.Id,
      name: productResult.Value.Name.Name,
      description: productResult.Value.Description.Description,
    };

    return Result.success(response, 200);
  }
}
