import { Controller, Post, Body } from '@nestjs/common';
import { CreateProductDto } from '../../aplication/dto/create-product.dto';
import { UpdateProductDto } from '../../aplication/dto/update-product.dto';

@Controller('product')
export class ProductController {
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    console.log('aqiitpokdsd');
  }
}
