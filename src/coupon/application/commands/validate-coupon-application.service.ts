import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { ValidateCouponServiceEntryDto } from '../dto/entry/validate-coupon-service-entry.dto';
import { ValidateCouponServiceResponseDto } from '../dto/response/validate-coupon-service-response.dto';
import { IDateService } from '../../../common/application/date-service/date-service.interface';

@Injectable()
export class ValidateCouponApplicationService implements IApplicationService<ValidateCouponServiceEntryDto, ValidateCouponServiceResponseDto> {
  constructor(
    private readonly couponRepository: ICouponRepository,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: ValidateCouponServiceEntryDto): Promise<Result<ValidateCouponServiceResponseDto>> {
    const currentDate = await this.dateService.now();
    const couponResult = await this.couponRepository.validateCoupon(data.code.toUpperCase(), currentDate, data.id_customer);

    if (!couponResult.isSuccess || couponResult.Value === null) {
      return Result.fail<ValidateCouponServiceResponseDto>(null, couponResult.StatusCode, couponResult.Message);
    }
    const coupon = couponResult.Value;

    const response: ValidateCouponServiceResponseDto = {
      id: coupon.Id.Id,
      porcentage: coupon.Porcentage.Porcentage,
    };

    return Result.success<ValidateCouponServiceResponseDto>(response, 200);
  }
}
