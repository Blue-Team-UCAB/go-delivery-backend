import { Controller, Post, Body, Get, Query, ValidationPipe, Inject, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { CreateCouponApplicationService } from '../../application/commands/create-coupon-application.service';
import { GetCouponPageApplicationService } from '../../application/queries/get-coupon-page.application.service';
import { CouponRepository } from '../repository/coupon.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { GetCouponPageDto } from '../dto/get-coupon-page.dto';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { ValidateCouponDto } from '../dto/validate-coupon.dto';
import { ValidateCouponApplicationService } from 'src/coupon/application/commands/validate-coupon-application.service';
import { UseAuth } from '../../../auth/infrastructure/jwt/decorator/useAuth.decorator';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { GetUser } from '../../../auth/infrastructure/jwt/decorator/get-user.decorator';

@ApiTags('Coupons')
@Controller('coupon')
export class CouponController {
  private readonly couponRepository: CouponRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly uuidCreator: UuidGenerator,
    private readonly dateService: DateService,
  ) {
    this.couponRepository = new CouponRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    const service = new CreateCouponApplicationService(this.couponRepository, this.uuidCreator, this.dateService);
    return await service.execute(createCouponDto);
  }

  @Get()
  @IsClientOrAdmin()
  async getCoupons(@Query(ValidationPipe) query: GetCouponPageDto) {
    const { page, perpage, search } = query;
    const service = new GetCouponPageApplicationService(this.couponRepository, this.dateService);
    return await service.execute({ page, perpage, search });
  }

  @Post('validate-coupon')
  @UseAuth()
  @IsClientOrAdmin()
  async validateCoupon(@Body() validateCouponDto: ValidateCouponDto, @GetUser() user: any) {
    const service = new ValidateCouponApplicationService(this.couponRepository, this.dateService);
    return await service.execute({ ...validateCouponDto, id_customer: user.idCostumer });
  }
}
