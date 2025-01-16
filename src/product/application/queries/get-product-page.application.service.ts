import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetProductPageServiceEntryDto } from '../dto/entry/get-product-page-service-entry.dto';
import { GetProductPageServiceResponseDto } from '../dto/response/get-product-page-service-response.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/product';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { Discount } from '../../../discount/domain/discount';
import { IDiscountRepository } from '../../../discount/domain/repositories/discount-repository.interface';
import { IStrategyToSelectDiscount } from '../../../common/domain/discount-strategy/select-discount-strategy.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';

export class GetProductByPageApplicationService implements IApplicationService<GetProductPageServiceEntryDto, GetProductPageServiceResponseDto[]> {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly discountRepository: IDiscountRepository,
    private readonly selectDiscountStrategy: IStrategyToSelectDiscount,
    private readonly s3Service: IStorageS3Service,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: GetProductPageServiceEntryDto): Promise<Result<GetProductPageServiceResponseDto[]>> {
    const productResult: Result<Product[]> = await this.productRepository.findAllProducts(data.page, data.perpage, data.category, data.name, data.price, data.popular, data.discount);

    if (!productResult.isSuccess()) {
      return Result.fail(productResult.Error, productResult.StatusCode, productResult.Message);
    }

    const currentDate = await this.dateService.now();

    const products = await Promise.all(
      productResult.Value.map(async product => {
        const imageUrl: string = await this.s3Service.getFile(product.ImageUrl.Url);

        const discounts: Result<Discount[]> = await this.discountRepository.findDiscountByProduct(product, currentDate);
        const discount: Discount = discounts.isSuccess() && discounts.Value.length > 0 ? this.selectDiscountStrategy.selectDiscount(discounts.Value) : null;

        return {
          id: product.Id.Id,
          name: product.Name.Name,
          description: product.Description.Description,
          currency: product.Currency.Currency,
          price: product.Price.Price,
          stock: product.Stock.Stock,
          weight: product.Weight.Weight,
          measurement: product.Measurement.Measurement,
          images: [imageUrl],
          discount: discount ? [{ id: discount.Id.Id, percentage: discount.Percentage.Percentage }] : [],
        };
      }),
    );

    return Result.success<GetProductPageServiceResponseDto[]>(products, 200);
  }
}
