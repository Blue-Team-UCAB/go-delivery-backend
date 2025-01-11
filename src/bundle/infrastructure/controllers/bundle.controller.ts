import { Controller, Post, Body, Inject, UploadedFile, UseInterceptors, Get, Param, ValidationPipe, Query } from '@nestjs/common';
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
import { GetBundleByPageApplicationService } from 'src/bundle/application/queries/get-bundle-page.application.service';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { CategoryRepository } from '../../../category/infrastructure/repository/category.repository';
import { DiscountRepository } from '../../../discount/infrastructure/repository/discount.repository';
import { BestForTheCustomerStrategy } from '../../../common/infrastructure/select-discount-strategies/best-for-the-customer-strategy';

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
    const service = new createBundleApplicationService(this.bundleRepository, this.productRepository, this.categoryRepository, this.uuidCreator, this.s3Service, this.dateService);
    createBundleDto.imageBuffer = image.buffer;
    createBundleDto.contentType = image.mimetype;
    return await service.execute(createBundleDto);
  }

  @Get(':id')
  @IsClientOrAdmin()
  async getBundleId(@Param('id') id: string) {
    const service = new GetBundleByIdApplicationService(this.bundleRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService);
    return await service.execute({ id: id });
  }

  @Get()
  @IsClientOrAdmin()
  async getBundleByPage(@Query(ValidationPipe) query: GetBundlePageDto) {
    const { page, perpage } = query;
    const service = new GetBundleByPageApplicationService(this.bundleRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService);
    return await service.execute({ page, perpage });
  }
}
