import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { GetCouponIdServiceEntryDto } from '../dto/entry/get-coupon-id-service.entry.dto';
import { GetCouponIdServiceResponseDto } from '../dto/response/get-coupon-id-service-response.dto';

export class GetCouponByIdApplicationService implements IApplicationService<GetCouponIdServiceEntryDto, GetCouponIdServiceResponseDto> {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async execute(data: GetCouponIdServiceEntryDto): Promise<Result<GetCouponIdServiceResponseDto>> {
    const couponResult = await this.couponRepository.findCouponById(data.id);

    if (!couponResult.isSuccess()) {
      return Result.fail<GetCouponIdServiceResponseDto>(couponResult.Error, couponResult.StatusCode, couponResult.Message);
    }

    const response: GetCouponIdServiceResponseDto = {
      id: couponResult.Value.Id.Id,
      startDate: couponResult.Value.StartDate.StartDate,
      expirationDate: couponResult.Value.ExpirationDate.ExpirationDate,
      porcentage: couponResult.Value.Porcentage.Porcentage,
      code: couponResult.Value.Code.Code,
      message: {
        title: couponResult.Value.Message.Title,
        message: couponResult.Value.Message.Message,
      },
      numberUses: couponResult.Value.NumberUses.NumberUses,
      customer: couponResult.Value.Customers.map(customer => ({
        id_customer: customer.Id.Id,
        remaining_uses: customer.RemainingUses.RemainingUses,
      })),
    };

    return Result.success(response, 200);
  }
}
