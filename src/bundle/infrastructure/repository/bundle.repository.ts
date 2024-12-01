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
          'bundleProducts.id',
          'bundleProducts.quantity',
          'product.id_Product',
          'product.name_Product',
          'product.price_Product',
          'product.weight_Product',
          'product.image_Product',
          // 'bundleBundle.id',
          // 'bundleBundle.quantity',
          // 'childBundle.id',
          // 'childBundle.name',
          // 'childBundle.price',
          // 'childBundle.weight',
          // 'childBundle.imageUrl',
        ])
        .leftJoinAndSelect('bundle.bundleProducts', 'bundleProducts')
        .leftJoinAndSelect('bundleProducts.product', 'product')
        // .leftJoinAndSelect('bundle.parentBundles', 'bundleBundle')
        // .leftJoinAndSelect('bundleBundle.childBundle', 'childBundle')
        .where('bundle.id = :id', { id })
        .getOne();

      const resp = await this.bundleMapper.fromPersistenceToDomain(bundle, true);
      if (!resp) {
        return Result.fail(null, 404, 'No existe el combo Solicitado');
      }
      return Result.success<Bundle>(resp, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async findAllBundles(page: number, perpage: number): Promise<Result<Bundle[]>> {
    try {
      const skip = perpage * page - perpage;
      const bundles = await this.createQueryBuilder('bundle')
        .select(['bundle.id', 'bundle.name', 'bundle.description', 'bundle.currency', 'bundle.price', 'bundle.stock', 'bundle.weight', 'bundle.imageUrl', 'bundle.caducityDate'])
        .skip(skip)
        .take(perpage)
        .getMany();
      const resp = await Promise.all(bundles.map(bundle => this.bundleMapper.fromPersistenceToDomain(bundle, false)));
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
