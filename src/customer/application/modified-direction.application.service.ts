import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetDirectionResponseDto } from './dtos/response/get-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { ModifyDirectionEntryDto } from './dtos/entry/modify-direction.entry.dto';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IDirrecionRepository } from '../domain/repositories/direction-repository.interface';
import { DirectionId } from '../domain/value-objects/direction-id';
import { DirectionDescription } from '../domain/value-objects/direction-direction';
import { DirectionLatitude } from '../domain/value-objects/direction-latitude';
import { DirectionLonguitud } from '../domain/value-objects/direction-longuitude';
import { DirectionName } from '../domain/value-objects/direction-name';

export class ModifiedDirecionApplicationService implements IApplicationService<ModifyDirectionEntryDto, GetDirectionResponseDto> {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(data: ModifyDirectionEntryDto): Promise<Result<GetDirectionResponseDto>> {
    const costumer = await this.customerRepository.findById(data.costumerId);

    if (!costumer.isSuccess()) {
      return Result.fail(null, costumer.StatusCode, costumer.Message);
    }

    costumer.Value.modifyDirection(
      DirectionId.create(data.directionId),
      DirectionDescription.create(data.direction),
      DirectionLatitude.create(data.latitude),
      DirectionLonguitud.create(data.longitude),
      DirectionName.create(data.name),
    );

    const result = await this.customerRepository.saveCustomer(costumer.Value);

    if (!result.isSuccess()) {
      return Result.fail(null, result.StatusCode, result.Message);
    }

    return Result.success<GetDirectionResponseDto>(
      {
        id: data.directionId,
        name: data.name,
        direction: data.direction,
        lat: data.latitude,
        long: data.longitude,
        favorite: false,
      },
      200,
    );
  }
}
