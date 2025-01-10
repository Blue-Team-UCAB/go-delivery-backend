import { Discount } from '../../../discount/domain/discount';

export interface IStrategyToSelectDiscount {
  selectDiscount(discounts: Discount[]): Discount;
}
