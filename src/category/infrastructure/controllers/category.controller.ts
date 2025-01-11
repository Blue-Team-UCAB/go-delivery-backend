import { Body, Controller, Get, Inject, Post, Query, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryRepository } from '../repository/category.repository';
import { DataSource } from 'typeorm';
import { S3Service } from '../../../common/infrastructure/providers/services/s3.service';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { IsAdmin } from '../../../auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateCategoryApplicationService } from '../../application/commands/create-category-application.service';
import { IsClientOrAdmin } from '../../../auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { GetCategoryPageDto } from '../dto/get-category-page.to';
import { GetCategoryByPageApplicationService } from '../../application/queries/get-category-page.application.service';
import { GetCategoryIdApplicationService } from '../../application/queries/get-category-id.application.service';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  private readonly categoryRepository: CategoryRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
    private readonly uuidCreator: UuidGenerator,
  ) {
    this.categoryRepository = new CategoryRepository(this.dataSource);
  }

  @Post()
  @IsAdmin()
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() image: Express.Multer.File) {
    const service = new CreateCategoryApplicationService(this.categoryRepository, this.uuidCreator, this.s3Service);
    createCategoryDto.imageBuffer = image.buffer;
    createCategoryDto.contentType = image.mimetype;
    return await service.execute(createCategoryDto);
  }

  @Get('many')
  @IsClientOrAdmin()
  async getCategoryByPage(@Query(ValidationPipe) query: GetCategoryPageDto) {
    const { page, perpage } = query;
    const service = new GetCategoryByPageApplicationService(this.categoryRepository, this.s3Service);
    return await service.execute({ page, perpage });
  }

  @Get(':id')
  @IsClientOrAdmin()
  async getCategoryById(@Query('id') id: string) {
    const service = new GetCategoryIdApplicationService(this.categoryRepository, this.s3Service);
    return await service.execute({ id });
  }
}
