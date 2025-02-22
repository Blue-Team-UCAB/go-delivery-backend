import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetDirectionResponseDto } from './dtos/response/get-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { AddDirectionEntryDto } from './dtos/entry/add-direction.entry.dto';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { DirectionId } from '../domain/value-objects/direction-id';
import { DirectionDescription } from '../domain/value-objects/direction-direction';
import { DirectionLongitud } from '../domain/value-objects/direction-longitude';
import { DirectionLatitude } from '../domain/value-objects/direction-latitude';
import { DirectionName } from '../domain/value-objects/direction-name';

export class AddDirectionApplicationService implements IApplicationService<AddDirectionEntryDto, GetDirectionResponseDto> {
  constructor(
    private readonly _customerRepository: ICustomerRepository,
    private readonly idGenerator: IdGenerator<string>,
  ) {}

  async execute(data: AddDirectionEntryDto): Promise<Result<GetDirectionResponseDto>> {
    const customer = await this._customerRepository.findById(data.costumerId);
    if (!customer.isSuccess()) {
      return Result.fail<GetDirectionResponseDto>(customer.Error, customer.StatusCode, customer.Message);
    }

    const id = await this.idGenerator.generateId();
    customer.Value.addDirection(
      DirectionId.create(id),
      DirectionDescription.create(data.direction),
      DirectionLatitude.create(data.latitude),
      DirectionLongitud.create(data.longitude),
      DirectionName.create(data.name),
    );

    const result = await this._customerRepository.saveCustomer(customer.Value);

    if (!result.isSuccess()) {
      return Result.fail<GetDirectionResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    return Result.success<GetDirectionResponseDto>(
      {
        id: id,
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
