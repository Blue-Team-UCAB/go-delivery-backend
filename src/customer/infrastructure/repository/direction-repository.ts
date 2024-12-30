import { DataSource, Repository } from 'typeorm';
import { Result } from '../../../common/domain/result-handler/result';
import { Customer } from '../../domain/customer';
import { CustomerMapper } from '../mapper/customer.mapper';
import { DirectionORMEntity as DirectionOrm } from '../model/orm-direction.entity';
import { IDirrecionRepository } from 'src/customer/domain/repositories/direction-repository.interface';
import { Direction } from 'src/customer/domain/entities/direction';

export class DirectionRepository extends Repository<DirectionOrm> implements IDirrecionRepository {
  constructor(dataSource: DataSource) {
    super(DirectionOrm, dataSource.createEntityManager());
  }
  findById(id: string): Promise<Result<Direction>> {
    throw new Error('Method not implemented.');
  }
  saveDireccion(direccion: Direction): Promise<Result<Direction>> {
    throw new Error('Method not implemented.');
  }
}
