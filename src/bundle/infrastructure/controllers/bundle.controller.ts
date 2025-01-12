import { Controller, Post, Body, Inject, UploadedFile, UseInterceptors, Get, Param, ValidationPipe, Query, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BundleRepository } from '../repository/bundle.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { DataSource } from 'typeorm';
import { S3Service } from '../../../common/infrastructure/providers/services/s3.service';
import { CreateBundleDto } from '../dto/create-bundle.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { createBundleApplicationService } from '../../application/commands/created-bundle-application.service';
import { ProductRepository } from '../../../product/infrastructure/repository/product.repository';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { GetBundleByIdApplicationService } from '../../application/queries/get-bundle-id.application.service';
import { GetBundlePageDto } from '../dto/get-bundle-page.dto';
import { GetBundleByPageApplicationService } from '../../application/queries/get-bundle-page.application.service';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { CategoryRepository } from '../../../category/infrastructure/repository/category.repository';
import { DiscountRepository } from '../../../discount/infrastructure/repository/discount.repository';
import { BestForTheCustomerStrategy } from '../../../common/infrastructure/select-discount-strategies/best-for-the-customer-strategy';
import { ErrorHandlerAspect } from '../../../common/application/aspects/error-handler-aspect';

@ApiTags('Bundles')
@Controller('bundle')
export class BundleController {
  private readonly bundleRepository: BundleRepository;
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly discountRepository: DiscountRepository;
  private readonly uuidCreator: UuidGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
    private readonly dateService: DateService,
    private readonly bestForTheCustomerStrategy: BestForTheCustomerStrategy,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
    this.bundleRepository = new BundleRepository(this.dataSource);
    this.categoryRepository = new CategoryRepository(this.dataSource);
    this.discountRepository = new DiscountRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  @UseInterceptors(FileInterceptor('image'))
  async createBundle(@Body() createBundleDto: CreateBundleDto, @UploadedFile() image: Express.Multer.File) {
    const service = new ErrorHandlerAspect(
      new createBundleApplicationService(this.bundleRepository, this.productRepository, this.categoryRepository, this.uuidCreator, this.s3Service, this.dateService),
      (error: Error) => {
        throw new InternalServerErrorException(error.message);
      },
    );
    createBundleDto.imageBuffer = image.buffer;
    createBundleDto.contentType = image.mimetype;
    return (await service.execute(createBundleDto)).Value;
  }

  @Get('many')
  @IsClientOrAdmin()
  async getBundleByPage(@Query(ValidationPipe) query: GetBundlePageDto) {
    const { page, perpage } = query;
    const service = new ErrorHandlerAspect(
      new GetBundleByPageApplicationService(this.bundleRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService),
      (error: Error) => {
        throw new InternalServerErrorException(error.message);
      },
    );
    return (await service.execute({ page, perpage })).Value;
  }

  @Get(':id')
  @IsClientOrAdmin()
  async getBundleId(@Param('id') id: string) {
    const service = new ErrorHandlerAspect(
      new GetBundleByIdApplicationService(this.bundleRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService),
      (error: Error) => {
        throw new NotFoundException('Bundle not found');
      },
    );
    return (await service.execute({ id })).Value;
  }
}
