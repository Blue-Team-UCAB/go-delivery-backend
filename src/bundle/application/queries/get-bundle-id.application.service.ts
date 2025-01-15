import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetBundleIdServiceResponseDto } from '../dto/response/get-bundle-id-service.response.dto';
import { GetBundleIdServiceEntryDto } from '../dto/entry/get-bundle-id-service.entry.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IBundleRepository } from '../../domain/repositories/bundle-repository.interface';
import { Bundle } from '../../domain/bundle';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { BundleProduct } from '../../domain/entities/bundle-product';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { BundleProductResponseDto } from '../dto/response/create-bundle-service-response.dto';
import { Discount } from '../../../discount/domain/discount';
import { IDiscountRepository } from '../../../discount/domain/repositories/discount-repository.interface';
import { IStrategyToSelectDiscount } from '../../../common/domain/discount-strategy/select-discount-strategy.interface';
//import { BundleEntity } from '../../domain/entities/bundle';

@Injectable()
export class GetBundleByIdApplicationService implements IApplicationService<GetBundleIdServiceEntryDto, GetBundleIdServiceResponseDto> {
  constructor(
    private readonly bundleRepository: IBundleRepository,
    private readonly discountRepository: IDiscountRepository,
    private readonly selectDiscountStrategy: IStrategyToSelectDiscount,
    private readonly s3Service: IStorageS3Service,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: GetBundleIdServiceEntryDto): Promise<Result<GetBundleIdServiceResponseDto>> {
    const bundleResult: Result<Bundle> = await this.bundleRepository.findBundleById(data.id);

    if (!bundleResult.isSuccess()) {
      return Result.fail(bundleResult.Error, bundleResult.StatusCode, bundleResult.Message);
    }

    const currentDate = await this.dateService.now();
    const discounts: Result<Discount[]> = await this.discountRepository.findDiscountByBundle(bundleResult.Value, currentDate);
    if (!discounts.isSuccess()) {
      return Result.fail(discounts.Error, discounts.StatusCode, discounts.Message);
    }

    const discount: Discount = discounts.Value.length > 0 ? this.selectDiscountStrategy.selectDiscount(discounts.Value) : null;

    const imageUrl: string = await this.s3Service.getFile(bundleResult.Value.ImageUrl.Url);

    const products: BundleProductResponseDto[] = [];
    //const bundles: BundleProductResponseDto[] = [];

    for (const product of bundleResult.Value.Products) {
      if (product instanceof BundleProduct) {
        const imageUrlProduct = await this.s3Service.getFile(product.Image.Url);
        products.push({
          id: product.Id.Id,
          name: product.Name.Name,
          price: product.Price.Price,
          weight: product.Weight.Weight,
          quantity: product.Quantity.Quantity,
          //type: 'product',
          images: [imageUrlProduct],
        });
      } /*else if (product instanceof BundleEntity) {
        const imageUrlBundle = await this.s3Service.getFile(product.Image.Url);
        bundles.push({
          id: product.Id.Id,
          name: product.Name.Name,
          price: product.Price.Price,
          weight: product.Weight.Weight,
          quantity: product.Quantity.Quantity,
          type: 'bundle',
          imageUrl: imageUrlBundle,
        });
      }*/
    }

    const response: GetBundleIdServiceResponseDto = {
      name: bundleResult.Value.Name.Name,
      description: bundleResult.Value.Description.Description,
      currency: bundleResult.Value.Currency.Currency,
      price: bundleResult.Value.Price.Price,
      stock: bundleResult.Value.Stock.Stock,
      weight: bundleResult.Value.Weight.Weight,
      measurement: 'gr',
      images: [imageUrl],
      caducityDate: await this.dateService.toUtcMinus4(bundleResult.Value.CaducityDate.CaducityDate),
      product: products,
      category: bundleResult.Value.Categories.map(category => ({
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
      //bundles: bundles,
    };

    return Result.success(response, 200);
  }
}
