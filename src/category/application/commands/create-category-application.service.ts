import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { CreateCategoryServiceEntryDto } from '../dto/entry/create-category-service-entry.dto';
import { CreateCategoryServiceResponseDto } from '../dto/response/create-category-service-response.dto';
import { ICategoryRepository } from '../../domain/repositories/category-repository.interface';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { CategoryName } from '../../domain/value-objects/category-name';
import { CategoryImage } from '../../domain/value-objects/category-image';
import { Category } from '../../domain/category';
import { CategoryId } from 'src/category/domain/value-objects/category.id';

export class CreateCategoryApplicationService implements IApplicationService<CreateCategoryServiceEntryDto, CreateCategoryServiceResponseDto> {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: CreateCategoryServiceEntryDto): Promise<Result<CreateCategoryServiceResponseDto>> {
    const imageKey = `categories/${await this.idGenerator.generateId()}.png`;

    const dataCategory = {
      name: CategoryName.create(data.name),
      imageUrl: CategoryImage.create(imageKey),
    };

    const category = new Category(CategoryId.create(await this.idGenerator.generateId()), dataCategory.name, dataCategory.imageUrl);

    const result = await this.categoryRepository.saveCategoryAggregate(category);

    if (!result.isSuccess()) {
      return Result.fail<CreateCategoryServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const imageUrl = await this.s3Service.uploadFile(imageKey, data.imageBuffer, data.contentType);
    const imagenUrl = await this.s3Service.getFile(category.ImageUrl.Url);

    const response: CreateCategoryServiceResponseDto = {
      id: category.Id.Id,
      name: category.Name.Name,
      imageUrl: imagenUrl,
    };

    return Result.success<CreateCategoryServiceResponseDto>(response, 200);
  }
}
