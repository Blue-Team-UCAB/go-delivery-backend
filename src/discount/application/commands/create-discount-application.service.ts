import { IDiscountRepository } from '../../domain/repositories/discount-repository.interface';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { CreateDiscountServiceEntryDto } from '../dto/entry/create-discount-service-entry.dto';
import { CreateDiscountServiceResponseDto } from '../dto/response/create-discount-service-response.dto';
import { DiscountStartDate } from '../../domain/value-objects/discount-start-date';
import { DiscountExpirationDate } from '../../domain/value-objects/discount-expiration-date';
import { DiscountPercentage } from '../../domain/value-objects/discount-percentage';
import { DiscountState, DiscountStates } from '../../domain/value-objects/discount-state';
import { ProductId } from '../../../product/domain/value-objects/product.id';
import { BundleId } from '../../../bundle/domain/value-objects/bundle.id';
import { CategoryId } from '../../../category/domain/value-objects/category.id';
import { Discount } from '../../domain/discount';
import { DiscountId } from '../../domain/value-objects/discount.id';

export class CreateDiscountApplicationSergvice implements IApplicationService<CreateDiscountServiceEntryDto, CreateDiscountServiceResponseDto> {
  constructor(
    private readonly discountRepository: IDiscountRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: CreateDiscountServiceEntryDto): Promise<Result<CreateDiscountServiceResponseDto>> {
    const dataDiscount = {
      startDate: DiscountStartDate.create(data.startDate),
      expirationDate: DiscountExpirationDate.create(data.expirationDate, data.startDate),
      percentage: DiscountPercentage.create(data.percentage),
      state: DiscountState.create(DiscountStates.ACTIVE),
      products: data.products ? data.products.map(productId => ProductId.create(productId)) : [],
      bundles: data.bundles ? data.bundles.map(bundleId => BundleId.create(bundleId)) : [],
      categories: data.categories ? data.categories.map(categoryId => CategoryId.create(categoryId)) : [],
    };

    const discount = new Discount(
      DiscountId.create(await this.idGenerator.generateId()),
      dataDiscount.startDate,
      dataDiscount.expirationDate,
      dataDiscount.percentage,
      dataDiscount.state,
      dataDiscount.products,
      dataDiscount.bundles,
      dataDiscount.categories,
    );

    const result = await this.discountRepository.saveDiscountAggregate(discount);

    if (!result.isSuccess()) {
      return Result.fail<CreateDiscountServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const response: CreateDiscountServiceResponseDto = {
      id: discount.Id.Id,
      startDate: await this.dateService.toUtcMinus4(discount.StartDate.StartDate),
      expirationDate: await this.dateService.toUtcMinus4(discount.ExpirationDate.ExpirationDate),
      percentage: discount.Percentage.Percentage,
      state: discount.State.State,
      products: discount.Products ? discount.Products.map(productId => productId.Id) : [],
      bundles: discount.Bundles ? discount.Bundles.map(bundleId => bundleId.Id) : [],
      categories: discount.Categories ? discount.Categories.map(categoryId => categoryId.Id) : [],
    };

    return Result.success<CreateDiscountServiceResponseDto>(response, 200);
  }
}
