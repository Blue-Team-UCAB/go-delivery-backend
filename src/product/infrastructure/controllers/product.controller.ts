import { Controller, Post, Body, Inject, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { createProductApplicationService } from 'src/product/aplication/commands/create-product-application.service';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { ProductRepository } from '../repository/product.repository';
import { GetProductByIdApplicationService } from 'src/product/aplication/queries/get-product-id.application.service';
import { GetProductByPageApplicationService } from 'src/product/aplication/queries/get-product-page.application.service';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  private readonly productRepository: ProductRepository;
  private readonly uuidCreator: UuidGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
  }

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const service = new createProductApplicationService(this.productRepository, this.uuidCreator);
    return (await service.execute(createProductDto)).Value;
  }

  @Get(':id')
  async getProductId(@Param('id') id: string) {
    const service = new GetProductByIdApplicationService(this.productRepository);
    return (await service.execute({ id: id })).Value;
  }

  @Get(':page/:take')
  async getProductByPage(@Param('page', ParseIntPipe) page: number, @Param('take', ParseIntPipe) take: number) {
    const service = new GetProductByPageApplicationService(this.productRepository);
    return (await service.execute({ page: page, take: take })).Value;
  }
}
