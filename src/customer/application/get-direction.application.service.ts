import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { GetDirectionResponseDto } from './dtos/response/get-direction.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { GetDirectionEntryDto } from './dtos/entry/get-direction.entry.dto';

export class GetDirectionApplicationService implements IApplicationService<GetDirectionEntryDto, GetDirectionResponseDto> {
  execute(data: GetDirectionEntryDto): Promise<Result<GetDirectionResponseDto>> {
    throw new Error('Method not implemented.');
  }
}
