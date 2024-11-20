import { Controller, Post, Body, Inject, UploadedFile, UseInterceptors, Get, Param, ValidationPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BundleRepository } from '../repository/bundle.repository';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { DataSource } from 'typeorm';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { CreateBundleDto } from '../dto/create-bundle.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { createBundleApplicationService } from '../../application/commands/created-bundle-application.service';
import { ProductRepository } from '../../../product/infrastructure/repository/product.repository';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { GetBundleByIdApplicationService } from '../../application/queries/get-bundle-id.application.service';
import { GetBundlePageDto } from '../dto/get-bundle-page.dto';
import { GetBundleByPageApplicationService } from 'src/bundle/application/queries/get-bundle-page.application.service';

@ApiTags('Bundles')
@Controller('bundle')
export class BundleController {
  private readonly bundleRepository: BundleRepository;
  private readonly productRepository: ProductRepository;
  private readonly uuidCreator: UuidGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.productRepository = new ProductRepository(this.dataSource);
    this.bundleRepository = new BundleRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  @UseInterceptors(FileInterceptor('image'))
  async createBundle(@Body() createBundleDto: CreateBundleDto, @UploadedFile() image: Express.Multer.File) {
    const service = new createBundleApplicationService(this.bundleRepository, this.productRepository, this.uuidCreator, this.s3Service);
    createBundleDto.imageBuffer = image.buffer;
    createBundleDto.contentType = image.mimetype;
    return (await service.execute(createBundleDto)).Value;
  }

  @Get(':id')
  @IsClientOrAdmin()
  async getBundleId(@Param('id') id: string) {
    const service = new GetBundleByIdApplicationService(this.bundleRepository, this.s3Service);
    return (await service.execute({ id: id })).Value;
  }

  @Get()
  @IsClientOrAdmin()
  async getBundleByPage(@Query(ValidationPipe) query: GetBundlePageDto) {
    const { page, take } = query;
    const service = new GetBundleByPageApplicationService(this.bundleRepository, this.s3Service);
    return (await service.execute({ page, take })).Value;
  }
}
