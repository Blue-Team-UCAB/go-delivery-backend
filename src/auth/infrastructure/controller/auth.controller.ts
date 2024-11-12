import { Controller, Post, Body, Inject, Get, Param, ValidationPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { UserRepository } from '../repository/user.repository';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  private readonly userRepository: UserRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
  ) {
    this.userRepository = new UserRepository(this.dataSource);
  }
}
