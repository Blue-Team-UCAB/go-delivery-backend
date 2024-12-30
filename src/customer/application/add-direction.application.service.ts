import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetDirectionResponseDto } from './dtos/response/get-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { AddDirectionEntryDto } from './dtos/entry/add-direction.entry.dto';

export class AddDirectionApplicationService implements IApplicationService<AddDirectionEntryDto, GetDirectionResponseDto> {
  execute(data: AddDirectionEntryDto): Promise<Result<GetDirectionResponseDto>> {
    throw new Error('Method not implemented.');
  }
}
