import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { DeleteDirectionEntryDto } from './dtos/entry/delete-direction.entry.dto';
import { DeleteDirectionResponseDto } from './dtos/response/delete-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { DirectionId } from '../domain/value-objects/direction-id';
import { IDirrecionRepository } from '../domain/repositories/direction-repository.interface';

export class DeleteDirectionApplicationService implements IApplicationService<DeleteDirectionEntryDto, DeleteDirectionResponseDto> {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly directionRepository: IDirrecionRepository,
  ) {}
  async execute(data: DeleteDirectionEntryDto): Promise<Result<DeleteDirectionResponseDto>> {
    const customer = await this.customerRepository.findById(data.idCustomer);

    if (!customer.isSuccess()) {
      return Result.fail<DeleteDirectionResponseDto>(customer.Error, customer.StatusCode, customer.Message);
    }

    customer.Value.deleteDirection(new DirectionId(data.idDirection));

    const resp = await this.directionRepository.deleteDireccion(data.idDirection);

    if (!resp.isSuccess()) {
      return Result.fail<DeleteDirectionResponseDto>(resp.Error, resp.StatusCode, resp.Message);
    }
    return Result.success<DeleteDirectionResponseDto>('', 200);
  }
}
