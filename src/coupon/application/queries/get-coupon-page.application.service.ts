import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { GetCouponPageServiceEntryDto } from '../dto/entry/get-coupon-page-service-entry.dto';
import { GetCouponPageServiceResponseDto } from '../dto/response/get-coupon-page-service-response.dto';

export class GetCouponPageApplicationService implements IApplicationService<GetCouponPageServiceEntryDto, GetCouponPageServiceResponseDto> {
  constructor(
    private readonly couponRepository: ICouponRepository,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: GetCouponPageServiceEntryDto): Promise<Result<GetCouponPageServiceResponseDto>> {
    const couponResult = await this.couponRepository.findAllCoupons(data.page, data.perpage, data.search);

    if (!couponResult.isSuccess()) {
      return Result.fail<GetCouponPageServiceResponseDto>(couponResult.Error, couponResult.StatusCode, couponResult.Message);
    }

    const coupons = await Promise.all(
      couponResult.Value.map(async coupon => ({
        id: coupon.Id.Id,
        startDate: await this.dateService.toUtcMinus4(coupon.StartDate.StartDate),
        expirationDate: await this.dateService.toUtcMinus4(coupon.ExpirationDate.ExpirationDate),
        porcentage: coupon.Porcentage.Porcentage,
        code: coupon.Code.Code,
        message: {
          title: coupon.Message.Title,
          message: coupon.Message.Message,
        },
        numberUses: coupon.NumberUses.NumberUses,
      })),
    );

    const response: GetCouponPageServiceResponseDto = {
      coupons: coupons,
    };

    return Result.success<GetCouponPageServiceResponseDto>(response, 200);
  }
}
