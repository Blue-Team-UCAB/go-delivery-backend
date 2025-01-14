import { ICategoryRepository } from '../../domain/repositories/category-repository.interface';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetCategoryPageServiceEntryDto } from '../dto/entry/get-category-page-service-entry.dto';
import { GetCategoryPageServiceResponseDto } from '../dto/response/get-category-page-serice-response.dto';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { Category } from '../../domain/category';

export class GetCategoryByPageApplicationService implements IApplicationService<GetCategoryPageServiceEntryDto, GetCategoryPageServiceResponseDto> {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: GetCategoryPageServiceEntryDto): Promise<Result<GetCategoryPageServiceResponseDto>> {
    const categoryResult: Result<Category[]> = await this.categoryRepository.findAllCategories(data.page, data.perpage);

    if (!categoryResult.isSuccess()) {
      return Result.fail(categoryResult.Error, categoryResult.StatusCode, categoryResult.Message);
    }

    const categories = await Promise.all(
      categoryResult.Value.map(async category => {
        const imageUrl: string = await this.s3Service.getFile(category.ImageUrl.Url);
        return {
          id: category.Id.Id,
          name: category.Name.Name,
          imageUrl: imageUrl,
        };
      }),
    );

    const response: GetCategoryPageServiceResponseDto = {
      categories: categories,
    };

    return Result.success(response, 200);
  }
}
