import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentMethodEntryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Name of the payment method',
  })
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: 'State of the payment method',
  })
  @Type(() => Boolean)
  state: boolean;
}
