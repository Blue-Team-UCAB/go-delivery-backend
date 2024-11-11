import { Controller, Post, Body, Inject, Get, Param, ValidationPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { createProductApplicationService } from '../../aplication/commands/create-product-application.service';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { ProductRepository } from '../repository/product.repository';
import { GetProductByIdApplicationService } from '../../aplication/queries/get-product-id.application.service';
import { GetProductByPageApplicationService } from '../../aplication/queries/get-product-page.application.service';
import { GetProductPageDto } from '../dto/get-product-page.dto';
import { S3Service } from '../../../common/infrastructure/providers/services/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  private readonly productRepository: ProductRepository;
  private readonly uuidCreator: UuidGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() image: Express.Multer.File) {
    const service = new createProductApplicationService(this.productRepository, this.uuidCreator, this.s3Service);
    createProductDto.imageBuffer = image.buffer;
    createProductDto.contentType = image.mimetype;
    return (await service.execute(createProductDto)).Value;
  }

  @Get(':id')
  async getProductId(@Param('id') id: string) {
    const service = new GetProductByIdApplicationService(this.productRepository, this.s3Service);
    return (await service.execute({ id: id })).Value;
  }

  @Get()
  async getProductByPage(@Query(ValidationPipe) query: GetProductPageDto) {
    const { page, take } = query;
    const service = new GetProductByPageApplicationService(this.productRepository, this.s3Service);
    return (await service.execute({ page, take })).Value;
  }
}
