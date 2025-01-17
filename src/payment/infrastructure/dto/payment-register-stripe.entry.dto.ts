import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentRegisterStripeEntryDto {
  @ApiProperty({
    description: 'Card Token',
    example: 'pm_254021654021410',
  })
  @IsString()
  @IsNotEmpty()
  idCard: string;
}
