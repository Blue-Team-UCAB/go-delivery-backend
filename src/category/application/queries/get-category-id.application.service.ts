import { ICategoryRepository } from '../../domain/repositories/category-repository.interface';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { GetCategoryIdServiceEntryDto } from '../dto/entry/get-category-id-service-entry.dto';
import { GetCategoryIdServiceResponseDto } from '../dto/response/get-category-id-service-response.dto';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { Result } from '../../../common/domain/result-handler/result';

export class GetCategoryIdApplicationService implements IApplicationService<GetCategoryIdServiceEntryDto, GetCategoryIdServiceResponseDto> {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: GetCategoryIdServiceEntryDto): Promise<Result<GetCategoryIdServiceResponseDto>> {
    const categoryResult = await this.categoryRepository.findCategoryById(data.id);

    if (!categoryResult.isSuccess()) {
      return Result.fail(categoryResult.Error, categoryResult.StatusCode, categoryResult.Message);
    }

    const imageUrl = await this.s3Service.getFile(categoryResult.Value.ImageUrl.Url);

    const response: GetCategoryIdServiceResponseDto = {
      name: categoryResult.Value.Name.Name,
      image: imageUrl,
    };

    return Result.success(response, 200);
  }
}
