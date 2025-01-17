import { Result } from 'src/common/domain/result-handler/result';
import { CourierDto } from '../dto/response/change-order-status.response.dto';

export interface ICourierRepository {
  findAllCourier(): Promise<Result<CourierDto[]>>;
}
