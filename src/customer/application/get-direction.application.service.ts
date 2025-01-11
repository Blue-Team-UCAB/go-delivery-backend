import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetDirectionResponseDto } from './dtos/response/get-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { GetDirectionEntryDto } from './dtos/entry/get-direction.entry.dto';
import { IDirrecionRepository } from '../domain/repositories/direction-repository.interface';

export class GetDirectionApplicationService implements IApplicationService<GetDirectionEntryDto, GetDirectionResponseDto> {
  constructor(private readonly directionRepository: IDirrecionRepository) {}

  async execute(data: GetDirectionEntryDto): Promise<Result<GetDirectionResponseDto>> {
    const direction = await this.directionRepository.findById(data.idDirection);

    if (!direction.isSuccess()) {
      return Result.fail(null, direction.StatusCode, direction.Message);
    }

    return Result.success<GetDirectionResponseDto>(
      {
        id: direction.Value.Id.Id,
        name: direction.Value.Name.Name,
        direction: direction.Value.Description.Description,
        lat: direction.Value.Latitude.Latitude,
        long: direction.Value.Longuitud.Longuitud,
        favorite: false,
      },
      200,
    );
  }
}
