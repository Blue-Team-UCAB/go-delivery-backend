import { Controller, Post, Body, Get, Query, ValidationPipe, Inject, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { CreateCouponApplicationService } from '../../application/commands/create-coupon-application.service';
import { GetCouponPageApplicationService } from '../../application/queries/get-coupon-page.application.service';
import { CouponRepository } from '../repository/coupon.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { IDateService } from '../../../common/application/date-service/date-service.interface';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { GetCouponPageDto } from '../dto/get-coupon-page.dto';

@ApiTags('Coupons')
@Controller('coupon')
export class CouponController {
  private readonly couponRepository: CouponRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly uuidCreator: UuidGenerator,
    private readonly dateService: IDateService,
  ) {
    this.couponRepository = new CouponRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    const service = new CreateCouponApplicationService(this.couponRepository, this.uuidCreator, this.dateService);
    return (await service.execute(createCouponDto)).Value;
  }

  @Get()
  @IsClientOrAdmin()
  async getCoupons(@Query(ValidationPipe) query: GetCouponPageDto) {
    const { page, perpage, search } = query;
    const service = new GetCouponPageApplicationService(this.couponRepository, this.dateService);
    return (await service.execute({ page, perpage, search })).Value;
  }
}
