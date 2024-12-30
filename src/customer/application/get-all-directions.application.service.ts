import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetDirectionResponseDto } from './dtos/response/get-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { GetAllDirectionEntryDto } from './dtos/entry/get-all-direction.entry.dto';

export class GetAllDirectionApplicationService implements IApplicationService<GetAllDirectionEntryDto, GetDirectionResponseDto> {
  execute(data: GetAllDirectionEntryDto): Promise<Result<GetDirectionResponseDto>> {
    throw new Error('Method not implemented.');
  }
}
