import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetApplicableCouponsByCustomerServiceEntryDto } from '../dto/entry/get-applicable-coupon-customer-entry.dto';
import { GetApplicableCouponsByCustomerServiceResponseDto } from '../dto/response/get-applicable-coupon-customer-response.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';

export class GetApplicableCouponsByCustomerApplicationService implements IApplicationService<GetApplicableCouponsByCustomerServiceEntryDto, GetApplicableCouponsByCustomerServiceResponseDto> {
  constructor(
    private readonly couponRepository: ICouponRepository,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: GetApplicableCouponsByCustomerServiceEntryDto): Promise<Result<GetApplicableCouponsByCustomerServiceResponseDto>> {
    const couponResult = await this.couponRepository.findApplicableCouponsByCustomer(data.id_customer);
    if (!couponResult.isSuccess) {
      return Result.fail<GetApplicableCouponsByCustomerServiceResponseDto>(couponResult.Error, couponResult.StatusCode, couponResult.Message);
    }

    const coupons = await Promise.all(
      couponResult.Value.map(async coupon => ({
        id: coupon.Id.Id,
        expirationDate: await this.dateService.toUtcMinus4(coupon.ExpirationDate.ExpirationDate),
        porcentage: coupon.Porcentage.Porcentage,
        code: coupon.Code.Code,
        numberUses: coupon.NumberUses.NumberUses,
      })),
    );

    const response: GetApplicableCouponsByCustomerServiceResponseDto = {
      coupons: coupons,
    };

    return Result.success<GetApplicableCouponsByCustomerServiceResponseDto>(response, 200);
  }
}
