import { ICouponRepository } from '../../domain/repositories/coupon-repository.interface';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { CreateCouponServiceEntryDto } from '../dto/entry/create-coupon-service-entry.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { CreateCouponServiceResponseDto } from '../dto/response/create-cupon-service-response.dto';
import { CouponStartDate } from '../../domain/value-objects/coupon-start-date';
import { CouponExpirationDate } from '../../domain/value-objects/coupon-expiration-date';
import { CouponPorcentage } from '../../domain/value-objects/coupon-porcentage';
import { CouponCode } from '../../domain/value-objects/coupon-code';
import { CouponMessage } from '../../domain/value-objects/coupon-message';
import { CouponNumberUses } from '../../domain/value-objects/coupon-number-uses';
import { Coupon } from '../../domain/coupon';
import { CouponId } from '../../domain/value-objects/coupon.id';
import { IDateService } from '../../../common/application/date-service/date-service.interface';

export class CreateCouponApplicationService implements IApplicationService<CreateCouponServiceEntryDto, CreateCouponServiceResponseDto> {
  constructor(
    private readonly couponRepository: ICouponRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly dateService: IDateService,
  ) {}

  async execute(data: CreateCouponServiceEntryDto): Promise<Result<CreateCouponServiceResponseDto>> {
    const dataCoupon = {
      startDate: CouponStartDate.create(data.startDate),
      expirationDate: CouponExpirationDate.create(data.expirationDate, data.startDate),
      porcentage: CouponPorcentage.create(data.porcentage),
      code: CouponCode.create(data.code.toUpperCase()),
      message: CouponMessage.create(data.title, data.message),
      numberUses: CouponNumberUses.create(data.numberUses),
    };

    const coupon = new Coupon(
      CouponId.create(await this.idGenerator.generateId()),
      dataCoupon.startDate,
      dataCoupon.expirationDate,
      dataCoupon.porcentage,
      dataCoupon.code,
      dataCoupon.message,
      dataCoupon.numberUses,
    );

    const result = await this.couponRepository.saveCouponAggregate(coupon);

    if (!result.isSuccess()) {
      return Result.fail<CreateCouponServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const response: CreateCouponServiceResponseDto = {
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
    };

    return Result.success<CreateCouponServiceResponseDto>(response, 200);
  }
}
