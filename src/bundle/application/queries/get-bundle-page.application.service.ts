import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetBundlePageServiceEntryDto } from '../dto/entry/get-bundle-page-service-entry.dto';
import { GetBundlePageServiceResponseDto } from '../dto/response/get-bundle-page-service-response.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IBundleRepository } from '../../domain/repositories/bundle-repository.interface';
import { Bundle } from '../../domain/bundle';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { Discount } from '../../../discount/domain/discount';
import { IDiscountRepository } from '../../../discount/domain/repositories/discount-repository.interface';
import { IStrategyToSelectDiscount } from '../../../common/domain/discount-strategy/select-discount-strategy.interface';

@Injectable()
export class GetBundleByPageApplicationService implements IApplicationService<GetBundlePageServiceEntryDto, GetBundlePageServiceResponseDto> {
  constructor(
    private readonly bundleRepository: IBundleRepository,
    private readonly discountRepository: IDiscountRepository,
    private readonly selectDiscountStrategy: IStrategyToSelectDiscount,
    private readonly s3Service: IStorageS3Service,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: GetBundlePageServiceEntryDto): Promise<Result<GetBundlePageServiceResponseDto>> {
    const bundleResult: Result<Bundle[]> = await this.bundleRepository.findAllBundles(data.page, data.perpage);

    if (!bundleResult.isSuccess) {
      return Result.fail(bundleResult.Error, bundleResult.StatusCode, bundleResult.Message);
    }

    const currentDate = await this.dateService.now();

    const bundles = await Promise.all(
      bundleResult.Value.map(async bundle => {
        const imageUrl: string = await this.s3Service.getFile(bundle.ImageUrl.Url);

        const discounts: Result<Discount[]> = await this.discountRepository.findDiscountByBundle(bundle, currentDate);
        const discount: Discount = discounts.Value.length > 0 ? this.selectDiscountStrategy.selectDiscount(discounts.Value) : null;

        return {
          id: bundle.Id.Id,
          name: bundle.Name.Name,
          description: bundle.Description.Description,
          currency: bundle.Currency.Currency,
          price: bundle.Price.Price,
          stock: bundle.Stock.Stock,
          weight: bundle.Weight.Weight,
          measurement: 'gr',
          images: [imageUrl],
          discount: discount
            ? [
                {
                  id: discount.Id.Id,
                  percentage: discount.Percentage.Percentage,
                },
              ]
            : [],
        };
      }),
    );

    const response: GetBundlePageServiceResponseDto = {
      bundles: bundles,
    };

    return Result.success(response, 200);
  }
}
