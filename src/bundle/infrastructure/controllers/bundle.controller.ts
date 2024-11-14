import { Controller, Post, Body, Inject, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BundleRepository } from '../repository/bundle.repository';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { DataSource } from 'typeorm';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { CreateBundleDto } from './create-bundle.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { createBundleApplicationService } from '../../application/commands/created-bundle-application.service';
import { ProductRepository } from '../../../product/infrastructure/repository/product.repository';

@ApiTags('Bundles')
@Controller('bundle')
export class BundleController {
  private readonly bundleRepository: BundleRepository;
  private readonly poductRepository: ProductRepository;
  private readonly uuidCreator: UuidGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly S3Service: S3Service,
  ) {
    this.uuidCreator = new UuidGenerator();
    this.bundleRepository = new BundleRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  @UseInterceptors(FileInterceptor('image'))
  async createBundle(@Body() createBundleDto: CreateBundleDto, @UploadedFile() image: Express.Multer.File) {
    const service = new createBundleApplicationService(this.bundleRepository, this.poductRepository, this.uuidCreator, this.S3Service);
    createBundleDto.imageBuffer = image.buffer;
    createBundleDto.contentType = image.mimetype;
    return (await service.execute(createBundleDto)).Value;
  }
}
