import { OrderBundle } from '../entities/order-bundle';
import { OrderProduct } from '../entities/order-product';

export class CalculateOrderSubTotalDomainService {
  static calculate(products: OrderProduct[], bundles: OrderBundle[]): number {
    return products.reduce((sum, product) => sum + product.Price.Price * product.Quantity.Quantity, 0) + bundles.reduce((sum, bundle) => sum + bundle.Price.Price * bundle.Quantity.Quantity, 0);
  }
}
