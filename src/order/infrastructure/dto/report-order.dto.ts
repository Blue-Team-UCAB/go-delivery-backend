import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ReportOrder {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'Order identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  orderId: string;

  @IsString()
  @ApiProperty({
    description: 'Order description',
    example: 'Order description',
  })
  description: string;
}
