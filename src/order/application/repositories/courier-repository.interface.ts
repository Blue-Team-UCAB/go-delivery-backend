import { Result } from 'src/common/domain/result-handler/result';
import { CourierDto } from 'src/order/application/dto/response/get-order-id-service.response.dto';

export interface ICourierRepository {
  findAllCourier(): Promise<Result<CourierDto[]>>;
}
