import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { IBundleRepository } from '../../domain/repositories/bundle-repository.interface';
import { Bundle } from '../../domain/bundle';
import { BundleORMEntity } from '../models/orm-bundle.entity';
import { BundleMapper } from '../mappers/bundle.mapper';
import { Result } from '../../../common/domain/result-handler/result';

@Injectable()
export class BundleRepository extends Repository<BundleORMEntity> implements IBundleRepository {
  private readonly bundleMapper: BundleMapper;

  constructor(dataSource: DataSource) {
    super(BundleORMEntity, dataSource.createEntityManager());
    this.bundleMapper = new BundleMapper();
  }

  async findBundleById(id: string): Promise<Result<Bundle>> {
    try {
      const bundleORM = await this.findOne({ where: { id }, relations: ['bundleProducts', 'bundleEntities'] });
      if (!bundleORM) {
        return Result.fail<Bundle>(new Error('Bundle not found'), 404, 'Bundle not found');
      }
      const bundle = await this.bundleMapper.fromPersistenceToDomain(bundleORM);
      return Result.success<Bundle>(bundle, 200);
    } catch (error) {
      return Result.fail<Bundle>(error, 500, error.message);
    }
  }

  // async findAllBundles(page: number, take: number): Promise<Result<Bundle[]>> {}

  async saveBundleAggregate(bundle: Bundle): Promise<Result<Bundle>> {
    try {
      const bundleORM = await this.bundleMapper.fromDomainToPersistence(bundle);
      await this.save(bundleORM);
      return Result.success<Bundle>(bundle, 200);
    } catch (error) {
      return Result.fail<Bundle>(new Error(error.message), error.code, error.message);
    }
  }
}
