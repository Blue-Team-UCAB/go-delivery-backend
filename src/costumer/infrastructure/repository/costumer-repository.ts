import { ICostumerRepository } from '../../domain/repositories/costumer-repository.interface';
import { CostumerORMEntity as CostumerORM } from '../model/orm-costumer.entity';
import { DataSource, Repository } from 'typeorm';
import { Result } from '../../../common/domain/result-handler/result';
import { Costumer } from '../../domain/costumer';
import { CostumerMapper } from '../mapper/costumer.mapper';

export class CostumerRepository extends Repository<CostumerORM> implements ICostumerRepository {
  private readonly costumerMapper: CostumerMapper;

  constructor(dataSource: DataSource) {
    super(CostumerORM, dataSource.createEntityManager());
    this.costumerMapper = new CostumerMapper();
  }

  async findById(id: string): Promise<Result<Costumer>> {
    try {
      const costumerORM = await this.createQueryBuilder('costumer')
        .select(['costumer.id_Costumer', 'costumer.name_Costumer', 'costumer.phone_Costumer', 'wallet.id_Wallet', 'wallet.amount_Wallet', 'wallet.currency_Wallet'])
        .leftJoin('costumer.wallet', 'wallet')
        .where('costumer.id_Costumer = :id', { id })
        .getOne();

      if (!costumerORM) {
        return Result.fail<Costumer>(null, 404, 'Costumer not found');
      }
      const costumer = await this.costumerMapper.fromPersistenceToDomain(costumerORM);
      return Result.success<Costumer>(costumer, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async saveCostumer(costumer: Costumer): Promise<Result<Costumer>> {
    try {
      const costumerORM = await this.costumerMapper.fromDomainToPersistence(costumer);
      await this.save(costumerORM);
      return Result.success<Costumer>(costumer, 201);
    } catch (e) {
      return Result.fail(new Error(e.message), 500, e.message);
    }
  }
}
