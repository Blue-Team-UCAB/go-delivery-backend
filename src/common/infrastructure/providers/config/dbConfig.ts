import { CustomerRepository } from 'src/customer/infrastructure/repository/costumer-repository';
import { UserRepository } from '../../../../auth/infrastructure/repository/user.repository';
import { ProductRepository } from '../../../../product/infrastructure/repository/product.repository';
import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { WalletRepository } from 'src/customer/infrastructure/repository/wallet-repository';
import { PaymentRepository } from 'src/payment/infrastructure/repository/payment-repository';
import { DirectionRepository } from 'src/customer/infrastructure/repository/direction-repository';
import { BundleRepository } from 'src/bundle/infrastructure/repository/bundle.repository';
import { DiscountRepository } from 'src/discount/infrastructure/repository/discount.repository';
import { CouponRepository } from 'src/coupon/infrastructure/repository/coupon.repository';
import { OrderRepository } from 'src/order/infrastructure/repository/order.repository';
import { CategoryRepository } from 'src/category/infrastructure/repository/category.repository';
import { MovementRepository } from 'src/order/infrastructure/repository/movement.repository';
import { PaymentMethodRepository } from 'src/payment/infrastructure/repository/payment-method.repository';

export const ormDatabaseProviders = [
  {
    provide: 'BaseDeDatos',

    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.PGDB_HOST,
        port: +process.env.PGDB_PORT,
        username: process.env.PGDB_USER,
        password: process.env.PGDB_PASSWORD,
        database: process.env.PGDB_NAME,
        schema: process.env.PGDB_SCHEMA,
        entities: getMetadataArgsStorage().tables.map(table => table.target),
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: true,
      });

      try {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
      } catch (error) {}

      return dataSource;
    },
  },

  {
    provide: 'ProductRepository',
    useFactory: (dataSource: DataSource) => {
      return new ProductRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },
  {
    provide: 'UserRepository',
    useFactory: (dataSource: DataSource) => {
      return new UserRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },

  {
    provide: 'CustomerRepository',
    useFactory: (dataSource: DataSource) => {
      return new CustomerRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },
  {
    provide: 'WalletRepository',
    useFactory: (dataSource: DataSource) => {
      return new WalletRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },
  {
    provide: 'PaymentRepository',
    useFactory: (dataSource: DataSource) => {
      return new PaymentRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },
  {
    provide: 'DirectionRepository',
    useFactory: (dataSource: DataSource) => {
      return new DirectionRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },
  {
    provide: 'CourierMovementRepository',
    useFactory: (dataSource: DataSource) => {
      return new MovementRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },
  {
    provide: 'PaymentMethodRepository',
    useFactory: (dataSource: DataSource) => {
      return new PaymentMethodRepository(dataSource);
    },
    inject: ['BaseDeDatos'],
  },

  // {
  //   provide: 'BundleRepository',
  //   useFactory: (dataSource: DataSource) => {
  //     return new BundleRepository(dataSource);
  //   },
  //   inject: ['BaseDeDatos'],
  // },
  // {
  //   provide: 'DiscountRepository',
  //   useFactory: (dataSource: DataSource) => {
  //     return new DiscountRepository(dataSource);
  //   },
  //   inject: ['BaseDeDatos'],
  // },
  // {
  //   provide: 'CouponRepository',
  //   useFactory: (dataSource: DataSource) => {
  //     return new CouponRepository(dataSource);
  //   },
  //   inject: ['BaseDeDatos'],
  // },
  // {
  //   provide: 'OrderRepository',
  //   useFactory: (dataSource: DataSource) => {
  //     return new OrderRepository(dataSource);
  //   },
  //   inject: ['BaseDeDatos'],
  // },
  // {
  //   provide: 'CategoryRepository',
  //   useFactory: (dataSource: DataSource) => {
  //     return new CategoryRepository(dataSource);
  //   },
  // },
];
