import { ProductRepository } from '../../../../product/infrastructure/repository/product.repository';
import { DataSource, getMetadataArgsStorage } from 'typeorm';

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
];
