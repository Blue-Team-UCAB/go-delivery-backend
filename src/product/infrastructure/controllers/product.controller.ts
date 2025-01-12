import { Controller, Post, Body, Inject, Get, Param, ValidationPipe, Query, UploadedFile, UseInterceptors, UseGuards, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { createProductApplicationService } from '../../application/commands/create-product-application.service';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { ProductRepository } from '../repository/product.repository';
import { GetProductByIdApplicationService } from '../../application/queries/get-product-id.application.service';
import { GetProductByPageApplicationService } from '../../application/queries/get-product-page.application.service';
import { GetProductPageDto } from '../dto/get-product-page.dto';
import { S3Service } from '../../../common/infrastructure/providers/services/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { EventPublisher } from '../../../common/infrastructure/Event-Publisher/eventPublisher.service';
import { DomainEvent } from 'src/common/domain/domain-event';
import { DiscountRepository } from '../../../discount/infrastructure/repository/discount.repository';
import { BestForTheCustomerStrategy } from '../../../common/infrastructure/select-discount-strategies/best-for-the-customer-strategy';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { CategoryRepository } from '../../../category/infrastructure/repository/category.repository';
import { ErrorHandlerAspect } from '../../../common/application/aspects/error-handler-aspect';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  private readonly productRepository: ProductRepository;
  private readonly discountRepository: DiscountRepository;
  private readonly categoryRepository: CategoryRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
    private readonly uuidCreator: UuidGenerator,
    private readonly publisher: EventPublisher<DomainEvent>,
    private readonly bestForTheCustomerStrategy: BestForTheCustomerStrategy,
    private readonly dateService: DateService,
  ) {
    this.productRepository = new ProductRepository(this.dataSource);
    this.discountRepository = new DiscountRepository(this.dataSource);
    this.categoryRepository = new CategoryRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() image: Express.Multer.File) {
    const service = new ErrorHandlerAspect(new createProductApplicationService(this.productRepository, this.categoryRepository, this.uuidCreator, this.s3Service, this.publisher), (error: Error) => {
      throw new InternalServerErrorException('Error creating product');
    });
    createProductDto.imageBuffer = image.buffer;
    createProductDto.contentType = image.mimetype;
    return (await service.execute(createProductDto)).Value;
  }

  @Get('many')
  @IsClientOrAdmin()
  async getProductByPage(@Query(ValidationPipe) query: GetProductPageDto) {
    const { page, perpage, category, name, price, popular, discount } = query;
    const service = new ErrorHandlerAspect(
      new GetProductByPageApplicationService(this.productRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService),
      (error: Error) => {
        throw new InternalServerErrorException('Error getting products');
      },
    );
    return (await service.execute({ page, perpage, category, name, price, popular, discount })).Value;
  }

  @Get(':id')
  @IsClientOrAdmin()
  async getProductId(@Param('id') id: string) {
    const service = new ErrorHandlerAspect(
      new GetProductByIdApplicationService(this.productRepository, this.discountRepository, this.bestForTheCustomerStrategy, this.s3Service, this.dateService),
      (error: Error) => {
        throw new NotFoundException('Product not found');
      },
    );
    return (await service.execute({ id })).Value;
  }
}
