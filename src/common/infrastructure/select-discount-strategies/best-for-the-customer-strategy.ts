import { IStrategyToSelectDiscount } from 'src/common/domain/discount-strategy/select-discount-strategy.interface';
import { Discount } from '../../../discount/domain/discount';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BestForTheCustomerStrategy implements IStrategyToSelectDiscount {
  selectDiscount(discounts: Discount[]): Discount {
    return discounts.reduce((prev, current) => (prev.Percentage.Percentage > current.Percentage.Percentage ? prev : current));
  }
}
