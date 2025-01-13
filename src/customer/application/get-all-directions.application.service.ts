import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetDirectionResponseDto } from './dtos/response/get-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { GetAllDirectionEntryDto } from './dtos/entry/get-all-direction.entry.dto';
import { IDirrecionRepository } from '../domain/repositories/direction-repository.interface';

export class GetAllDirectionApplicationService implements IApplicationService<GetAllDirectionEntryDto, GetDirectionResponseDto[]> {
  constructor(private readonly directionReposiroty: IDirrecionRepository) {}

  async execute(data: GetAllDirectionEntryDto): Promise<Result<GetDirectionResponseDto[]>> {
    const directions = await this.directionReposiroty.findAll(data.costumerId);

    if (!directions.isSuccess()) {
      return Result.fail(null, directions.StatusCode, directions.Message);
    }

    const response = directions.Value.map(direction => {
      return {
        id: direction.Id.Id,
        name: direction.Name.Name,
        direction: direction.Description.Description,
        long: direction.Longitud.Longitud,
        lat: direction.Latitude.Latitude,
        favorite: false,
      };
    });

    return Result.success<GetDirectionResponseDto[]>(response, 200);
  }
}
