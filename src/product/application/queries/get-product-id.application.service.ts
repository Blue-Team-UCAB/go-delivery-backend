import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetProductIdServiceResponseDto } from '../dto/response/get-product-id-service.response.dto';
import { GetProductIdServiceEntryDto } from '../dto/entry/get-product-id-service.entry.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/product';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { IDiscountRepository } from '../../../discount/domain/repositories/discount-repository.interface';
import { Discount } from '../../../discount/domain/discount';
import { IStrategyToSelectDiscount } from '../../../common/domain/discount-strategy/select-discount-strategy.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';

export class GetProductByIdApplicationService implements IApplicationService<GetProductIdServiceEntryDto, GetProductIdServiceResponseDto> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly discountRepository: IDiscountRepository,
    private readonly selectDiscountStrategy: IStrategyToSelectDiscount,
    private readonly s3Service: IStorageS3Service,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: GetProductIdServiceEntryDto): Promise<Result<GetProductIdServiceResponseDto>> {
    const productResult: Result<Product> = await this.productRepository.findProductById(data.id);

    if (!productResult.isSuccess) {
      return Result.fail(productResult.Error, productResult.StatusCode, productResult.Message);
    }

    const currentDate = await this.dateService.now();
    const discounts: Result<Discount[]> = await this.discountRepository.findDiscountByProduct(productResult.Value, currentDate);

    if (!discounts.isSuccess()) {
      return Result.fail(discounts.Error, discounts.StatusCode, discounts.Message);
    }

    const discount: Discount = discounts.Value.length > 0 ? this.selectDiscountStrategy.selectDiscount(discounts.Value) : null;

    const imageUrl: string = await this.s3Service.getFile(productResult.Value.ImageUrl.Url);

    const response: GetProductIdServiceResponseDto = {
      name: productResult.Value.Name.Name,
      description: productResult.Value.Description.Description,
      currency: productResult.Value.Currency.Currency,
      price: productResult.Value.Price.Price,
      stock: productResult.Value.Stock.Stock,
      weight: productResult.Value.Weight.Weight,
      measurement: productResult.Value.Measurement.Measurement,
      images: [imageUrl],
      category: productResult.Value.Categories.map(category => ({
        id: category.Id.Id,
        name: category.Name.Name,
      })),
      discount: discount
        ? [
            {
              id: discount.Id.Id,
              percentage: discount.Percentage.Percentage,
            },
          ]
        : [],
      caducityDate: new Date('2099-12-31'),
    };

    return Result.success(response, 200);
  }
}
