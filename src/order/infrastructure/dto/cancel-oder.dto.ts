import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CancelOrderDto {
  @ApiProperty({
    description: 'Order identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  orderId: string;
}
