import { ApiProperty } from '@nestjs/swagger';

export class PaymentRegisterStripeEntryDto {
  @ApiProperty({
    description: 'Card Token',
    example: 'pm_254021654021410',
  })
  idCard: string;
}
