import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';
import { OrderStates } from 'src/order/domain/value-objects/order-state';

export class ChangeOrderStatusDto {
  @ApiProperty({
    description: 'Order identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
  })
  @IsString()
  @ValidateIf(o => Object.keys(OrderStates).includes(o.status))
  status: string;
}
