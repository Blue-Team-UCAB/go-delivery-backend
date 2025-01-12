import { Controller, Post, Body, Get, Query, ValidationPipe, Inject, UseInterceptors, UploadedFile, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { CreateCouponApplicationService } from '../../application/commands/create-coupon-application.service';
import { GetCouponPageApplicationService } from '../../application/queries/get-coupon-page.application.service';
import { CouponRepository } from '../repository/coupon.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { GetCouponPageDto } from '../dto/get-coupon-page.dto';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { ClaimCouponDto } from '../dto/claim-coupon.dto';
import { ClaimCouponApplicationService } from '../../application/commands/claim-coupon-application.service';
import { UseAuth } from '../../../auth/infrastructure/jwt/decorator/useAuth.decorator';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { GetUser } from '../../../auth/infrastructure/jwt/decorator/get-user.decorator';
import { AuthInterface } from '../../../common/infrastructure/auth-interface/aunt.interface';
import { GetCouponByIdApplicationService } from '../../application/queries/get-coupon-id.application.service';
import { GetApplicableCouponsByCustomerApplicationService } from '../../application/queries/get-applicable-coupon-customer.application.service';
import { ErrorHandlerAspect } from '../../../common/application/aspects/error-handler-aspect';

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
    const service = new ErrorHandlerAspect(new CreateCouponApplicationService(this.couponRepository, this.uuidCreator, this.dateService), (error: Error) => {
      throw new InternalServerErrorException('Error creating coupon');
    });
    return (await service.execute(createCouponDto)).Value;
  }

  @Get('many')
  @IsClientOrAdmin()
  async getCoupons(@Query(ValidationPipe) query: GetCouponPageDto) {
    const { page, perpage, search } = query;
    const service = new ErrorHandlerAspect(new GetCouponPageApplicationService(this.couponRepository, this.dateService), (error: Error) => {
      throw new InternalServerErrorException('Error getting coupons');
    });
    return (await service.execute({ page, perpage, search })).Value;
  }

  @Get('applicable')
  @UseAuth()
  @IsClientOrAdmin()
  async getApplicableCoupons(@GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new GetApplicableCouponsByCustomerApplicationService(this.couponRepository, this.dateService), (error: Error) => {
      throw new InternalServerErrorException('Error getting applicable coupons');
    });
    return (await service.execute({ id_customer: user.idCostumer })).Value;
  }

  @Post('claim-coupon')
  @UseAuth()
  @IsClientOrAdmin()
  async validateCoupon(@Body() claimCouponDto: ClaimCouponDto, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new ClaimCouponApplicationService(this.couponRepository, this.dateService), (error: Error) => {
      throw new InternalServerErrorException('Error claiming coupon');
    });
    return (await service.execute({ ...claimCouponDto, id_customer: user.idCostumer })).Value;
  }

  @Get(':id')
  @IsClientOrAdmin()
  async getCoupon(@Query('id') id: string) {
    const service = new ErrorHandlerAspect(new GetCouponByIdApplicationService(this.couponRepository), (error: Error) => {
      throw new NotFoundException('Coupon not found');
    });
    return (await service.execute({ id })).Value;
  }
}
