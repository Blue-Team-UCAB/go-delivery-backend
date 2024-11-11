import { Controller, Post, Body, Inject, Get, Param, ValidationPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/application/model/user-model';
import { UserRepository } from '../repository/user.repository';
import { FireBaseAuthService } from '../../../common/infrastructure/providers/services/firebase-Auth.service';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  private readonly userRepository: UserRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly fireBaseService: FireBaseAuthService,
  ) {
    this.userRepository = new UserRepository(this.dataSource);
  }
}
