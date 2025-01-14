import { IDiscountRepository } from '../../../discount/domain/repositories/discount-repository.interface';
import { Coupon } from '../../../coupon/domain/coupon';
import { OrderBundle } from '../entities/order-bundle';
import { OrderProduct } from '../entities/order-product';
import { IProductRepository } from '../../../product/domain/repositories/product-repository.interface';
import { IBundleRepository } from '../../../bundle/domain/repositories/bundle-repository.interface';
import { IStrategyToSelectDiscount } from '../../../common/domain/discount-strategy/select-discount-strategy.interface';

export class CalculateOrderTotalDomainService {
  static async calculate(
    products: OrderProduct[],
    bundles: OrderBundle[],
    selectDiscountStrategy: IStrategyToSelectDiscount,
    discountRepository: IDiscountRepository,
    productRepository: IProductRepository,
    bundleRepository: IBundleRepository,
    currentDate: Date,
    coupon?: Coupon,
  ): Promise<number> {
    try {
      let total: number = 0;

      for (const product of products) {
        let productPrice = product.Price.Price * product.Quantity.Quantity;
        const productResult = await productRepository.findProductById(product.Id.Id);
        if (productResult.isSuccess()) {
          const product = productResult.Value;
          const discounts = await discountRepository.findDiscountByProduct(product, currentDate);
          if (discounts.isSuccess() && discounts.Value.length > 0) {
            const discount = selectDiscountStrategy.selectDiscount(discounts.Value);
            productPrice -= (productPrice * discount.Percentage.Percentage) / 100;
          }
          total += productPrice;
        }
      }

      for (const bundle of bundles) {
        const bundleResult = await bundleRepository.findBundleById(bundle.Id.Id);
        if (bundleResult.isSuccess()) {
          let bundlePrice = bundle.Price.Price * bundle.Quantity.Quantity;
          const discounts = await discountRepository.findDiscountByBundle(bundleResult.Value, currentDate);
          if (discounts.isSuccess() && discounts.Value.length > 0) {
            const discount = selectDiscountStrategy.selectDiscount(discounts.Value);
            bundlePrice -= (bundlePrice * discount.Percentage.Percentage) / 100;
          }
          total += bundlePrice;
        }
      }

      if (coupon) {
        total -= (total * coupon.Porcentage.Porcentage) / 100;
      }

      return total;
    } catch (error) {
      return;
    }
  }
}
