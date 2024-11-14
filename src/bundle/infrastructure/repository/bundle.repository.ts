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
      const bundle = await this.createQueryBuilder('bundle')
        .select([
          'bundle.id',
          'bundle.name',
          'bundle.description',
          'bundle.currency',
          'bundle.price',
          'bundle.stock',
          'bundle.weight',
          'bundle.imageUrl',
          'bundle.caducityDate',
          'bundleProducts',
          'bundleEntities',
        ])
        .leftJoinAndSelect('bundle.bundleProducts', 'bundleProducts')
        .leftJoinAndSelect('bundle.bundleEntities', 'bundleEntities')
        .where('bundle.id = :id', { id })
        .getOne();
      const resp = await this.bundleMapper.fromPersistenceToDomain(bundle);
      if (!resp) {
        return Result.fail(null, 404, 'No existe el combo Solicitado');
      }
      return Result.success<Bundle>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async findAllBundles(page: number, take: number): Promise<Result<Bundle[]>> {
    try {
      const skip = take * page - take;
      const bundles = await this.createQueryBuilder('bundle')
        .select([
          'bundle.id',
          'bundle.name',
          'bundle.description',
          'bundle.currency',
          'bundle.price',
          'bundle.stock',
          'bundle.weight',
          'bundle.imageUrl',
          'bundle.caducityDate',
          'bundleProducts',
          'bundleEntities',
        ])
        .leftJoinAndSelect('bundle.bundleProducts', 'bundleProducts')
        .leftJoinAndSelect('bundle.bundleEntities', 'bundleEntities')
        .skip(skip)
        .take(take)
        .getMany();

      const resp = await Promise.all(bundles.map(bundle => this.bundleMapper.fromPersistenceToDomain(bundle)));
      return Result.success<Bundle[]>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

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
