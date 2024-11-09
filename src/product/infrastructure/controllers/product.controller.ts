import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { createProductApplicationService } from 'src/product/aplication/commands/create-product-application.service';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { ProductRepository } from '../repository/product.repository';

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
    service.execute(createProductDto);
  }
}
