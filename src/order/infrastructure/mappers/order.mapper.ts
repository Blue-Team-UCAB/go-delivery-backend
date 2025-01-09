import { OrderProduct } from '../../domain/entities/order-product';
import { IMapper } from '../../../common/application/mapper/mapper.interface';
import { Order } from '../../domain/order';
import { OrderBundleORMEntity } from '../models/orm-order-bundle.entity';
import { OrderProductORMEntity } from '../models/orm-order-product.entity';
import { OrderORMEntity } from '../models/orm-order.entity';
import { ProductId } from '../../../product/domain/value-objects/product.id';
import { OrderProductName } from '../../domain/value-objects/order-product-name';
import { OrderProductPrice } from '../../domain/value-objects/order-product-price';
import { OrderProductImage } from '../../domain/value-objects/order-product-image';
import { OrderProductQuantity } from '../../domain/value-objects/order-product-quantity';
import { OrderId } from '../../domain/value-objects/order.id';
import { CustomerId } from '../../../customer/domain/value-objects/customer-id';
import { OrderState, OrderStates } from '../../domain/value-objects/order-state';
import { OrderCreatedDate } from '../../domain/value-objects/order-created-date';
import { OrderTotalAmount } from '../../domain/value-objects/order-total-amount';
import { OrderSubtotalAmount } from '../../domain/value-objects/order-subtotal-amount';
import { OrderDirection } from '../../domain/value-objects/order-direction';
import { OrderBundle } from '../../domain/entities/order-bundle';
import { BundleId } from '../../../bundle/domain/value-objects/bundle.id';
import { OrderBundleName } from '../../domain/value-objects/order-bundle-name';
import { OrderBundlePrice } from '../../domain/value-objects/order-bundle-price';
import { OrderBundleImage } from '../../domain/value-objects/order-bundle-image';
import { OrderBundleQuantity } from '../../domain/value-objects/order-bundle-quantity';
import { OrderReport } from '../../domain/value-objects/order-report';
import { OrderCourierId } from '../../domain/value-objects/order-courier.id';
import { OrderCourier } from '../../domain/entities/order-courier';
import { OrderCourierName } from '../../domain/value-objects/order-courier-name';
import { OrderCourierPhone } from '../../domain/value-objects/order-courier-phone';
import { OrderStateHistoryORMEntity } from '../models/orm-order-state.entity';
import { CouponId } from '../../../coupon/domain/value-objects/coupon.id';
import { OrderCourierImage } from 'src/order/domain/value-objects/order-courier-image';

export class OrderMapper implements IMapper<Order, OrderORMEntity> {
  async fromDomainToPersistence(domain: Order): Promise<OrderORMEntity> {
    const orderORM = new OrderORMEntity();
    orderORM.id_Order = domain.Id.Id;
    orderORM.createdDate_Order = domain.CreatedDate.CreatedDate;
    orderORM.totalAmount_Order = domain.TotalAmount.Amount;
    orderORM.subtotalAmount_Order = domain.SubtotalAmount.Amount;
    orderORM.direction_Order = domain.Direction.Direction;
    orderORM.longitude_Order = domain.Direction.Longitude;
    orderORM.latitude_Order = domain.Direction.Latitude;
    orderORM.claimDate_Order = domain.Report?.ClaimDate || null;
    orderORM.claim_Order = domain.Report?.Claim || null;
    orderORM.customer_Orders = { id_Costumer: domain.CustomerId.Id } as any;
    orderORM.courier_Orders = domain.Courier ? ({ id: domain.Courier.Id.Id } as any) : null;
    orderORM.coupon = domain.CouponId ? ({ id: domain.CouponId.Id } as any) : null;
    orderORM.order_Products = domain.Products.map(product => {
      const productORM = new OrderProductORMEntity();
      productORM.product = { id_Product: product.Id.Id } as any;
      productORM.quantity = product.Quantity.Quantity;
      return productORM;
    });
    orderORM.order_Bundles = domain.Bundles.map(bundle => {
      const bundleORM = new OrderBundleORMEntity();
      bundleORM.bundle = { id: bundle.Id.Id } as any;
      bundleORM.quantity = bundle.Quantity.Quantity;
      return bundleORM;
    });
    orderORM.order_StateHistory = domain.StateHistory.map(state => {
      const stateORM = new OrderStateHistoryORMEntity();
      stateORM.state = state.State;
      stateORM.date = state.Date;
      return stateORM;
    });
    return orderORM;
  }

  async fromPersistenceToDomain(persistence: OrderORMEntity, includeProducts: boolean = true): Promise<Order> {
    const products = includeProducts
      ? await Promise.all(
          persistence.order_Products.map(async orderProduct => {
            const product = orderProduct.product;
            if (!product) {
              throw new Error(`Product with ID ${orderProduct.id} not found`);
            }
            return new OrderProduct(
              ProductId.create(product.id_Product),
              OrderProductName.create(product.name_Product),
              OrderProductPrice.create(product.price_Product),
              OrderProductImage.create(product.image_Product),
              OrderProductQuantity.create(orderProduct.quantity),
            );
          }),
        )
      : [];
    const bundles = includeProducts
      ? await Promise.all(
          persistence.order_Bundles.map(async orderBundle => {
            const bundle = orderBundle.bundle;
            if (!bundle) {
              throw new Error(`Bundle with ID ${orderBundle.id} not found`);
            }
            return new OrderBundle(
              BundleId.create(bundle.id),
              OrderBundleName.create(bundle.name),
              OrderBundlePrice.create(bundle.price),
              OrderBundleImage.create(bundle.imageUrl),
              OrderBundleQuantity.create(orderBundle.quantity),
            );
          }),
        )
      : [];
    const stateHistory = persistence.order_StateHistory.map(state => {
      return OrderState.create(state.state as OrderStates, state.date);
    });
    const courier = persistence.courier_Orders
      ? new OrderCourier(
          OrderCourierId.create(persistence.courier_Orders.id),
          OrderCourierName.create(persistence.courier_Orders.name),
          OrderCourierPhone.create(persistence.courier_Orders.phone),
          OrderCourierImage.create(persistence.courier_Orders.image),
        )
      : null;
    const order = new Order(
      OrderId.create(persistence.id_Order),
      CustomerId.create(persistence.customer_Orders.id_Costumer),
      stateHistory,
      OrderCreatedDate.create(persistence.createdDate_Order),
      OrderTotalAmount.create(persistence.totalAmount_Order),
      OrderSubtotalAmount.create(persistence.subtotalAmount_Order),
      OrderDirection.create(persistence.direction_Order, persistence.longitude_Order, persistence.latitude_Order),
      products,
      bundles,
      courier,
      persistence.claimDate_Order ? OrderReport.create(persistence.claimDate_Order, persistence.claim_Order) : null,
      persistence.coupon ? CouponId.create(persistence.coupon.id) : null,
    );
    return order;
  }
}
