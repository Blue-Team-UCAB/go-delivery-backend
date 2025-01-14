import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { ClaimCouponServiceEntryDto } from '../dto/entry/claim-coupon-service-entry.dto';
import { ClaimCouponServiceResponseDto } from '../dto/response/claim-coupon-service-response.dto';
import { CustomerId } from '../../../customer/domain/value-objects/customer-id';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { CouponCustomer } from '../../domain/entities/coupon-customer';
import { CouponCustomerRemainingUses } from '../../domain/value-objects/coupon-customer-remaining-uses';
import { ICouponCustomerRepository } from 'src/coupon/domain/repositories/coupon-customer-repository.interface';

@Injectable()
export class ClaimCouponApplicationService implements IApplicationService<ClaimCouponServiceEntryDto, ClaimCouponServiceResponseDto> {
  constructor(
    private readonly couponRepository: ICouponRepository,
    private readonly couponCustomerRepository: ICouponCustomerRepository,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: ClaimCouponServiceEntryDto): Promise<Result<ClaimCouponServiceResponseDto>> {
    const currentDate = await this.dateService.now();
    const couponResult = await this.couponRepository.findCouponByCode(data.code);

    if (!couponResult.isSuccess() || couponResult.Value === null) {
      return Result.fail<ClaimCouponServiceResponseDto>(null, couponResult.StatusCode, couponResult.Message);
    }
    const coupon = couponResult.Value;

    const customerId = CustomerId.create(data.id_customer);

    if (!coupon.validateCouponClaimed(currentDate, customerId)) {
      return Result.fail<ClaimCouponServiceResponseDto>(null, 400, 'Coupon cant be claimed');
    }

    const reaminingUses = CouponCustomerRemainingUses.create(coupon.NumberUses.NumberUses);
    const couponCustomer = new CouponCustomer(customerId, reaminingUses);
    coupon.Customers.push(couponCustomer);

    const saveResult = await this.couponCustomerRepository.saveCouponCustomerRelation(coupon.Id.Id, customerId.Id, reaminingUses.RemainingUses);

    if (!saveResult.isSuccess()) {
      return Result.fail<ClaimCouponServiceResponseDto>(null, saveResult.StatusCode, saveResult.Message);
    }

    const response: ClaimCouponServiceResponseDto = {
      id: coupon.Id.Id,
      porcentage: coupon.Porcentage.Porcentage,
    };

    return Result.success<ClaimCouponServiceResponseDto>(response, 200);
  }
}
