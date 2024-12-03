import { CustomerRepository } from 'src/customer/infrastructure/repository/costumer-repository';
import { UserRepository } from '../../../../auth/infrastructure/repository/user.repository';
import { ProductRepository } from '../../../../product/infrastructure/repository/product.repository';
import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { WalletRepository } from 'src/customer/infrastructure/repository/wallet-repository';
import { PaymentRepository } from 'src/payment/infrastructure/repository/payment-repository';

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
      } catch (error) {
        console.error(error?.message);
      }

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
];
