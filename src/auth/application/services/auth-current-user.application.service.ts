import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { CurrentEntryServiceDto } from '../dto/entry/current.entry.application.dto';
import { CurrentResponseServiceDto } from '../dto/response/current.response.application.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { ICustomerRepository } from 'src/customer/domain/repositories/customer-repository.interface';

export class AuthCurrentApplicationService implements IApplicationService<CurrentEntryServiceDto, CurrentResponseServiceDto> {
  constructor(private readonly costumerRepository: ICustomerRepository) {}

  async execute(data: CurrentEntryServiceDto): Promise<Result<CurrentResponseServiceDto>> {
    const costumer = await this.costumerRepository.findById(data.idCostumer);

    if (!costumer.isSuccess()) {
      return Result.fail<CurrentResponseServiceDto>(null, 400, 'Costumer not found');
    }

    const response: CurrentResponseServiceDto = {
      id: data.id,
      email: data.email,
      name: costumer.Value.Name.Name,
      phone: costumer.Value.Phone.Phone,
      type: data.role,
    };

    return Result.success<CurrentResponseServiceDto>(response, 200);
  }
}
