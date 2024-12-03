import { IsString, ValidateIf } from 'class-validator';
import { OrderStates } from 'src/order/domain/value-objects/order-state';

export class ChangeOrderStatusDto {
  @IsString()
  orderId: string;

  @IsString()
  @ValidateIf(o => Object.keys(OrderStates).includes(o.status))
  status: string;
}
