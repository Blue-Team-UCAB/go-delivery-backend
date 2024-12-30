import { DataSource, Repository } from 'typeorm';
import { Result } from '../../../common/domain/result-handler/result';
import { DirectionMapper } from '../mapper/direction.mapper';
import { DirectionORMEntity as DirectionOrm } from '../model/orm-direction.entity';
import { IDirrecionRepository } from 'src/customer/domain/repositories/direction-repository.interface';
import { Direction } from 'src/customer/domain/entities/direction';

export class DirectionRepository extends Repository<DirectionOrm> implements IDirrecionRepository {
  directionMapper: any;
  constructor(dataSource: DataSource) {
    super(DirectionOrm, dataSource.createEntityManager());
    this.directionMapper = new DirectionMapper();
  }
  async findById(id: string): Promise<Result<Direction>> {
    try {
      const directionOrm = await this.createQueryBuilder('direction')
        .select(['direction.id_Direction', 'direction.direction_Direction', 'direction.latitude_Direction', 'direction.longuitud_Direction'])
        .where('direction.id_Direction = :id', { id })
        .getOne();

      if (!directionOrm) {
        return Result.fail(null, 404, 'Direction not found');
      }
      const direction = await this.directionMapper.fromPersistenceToDomain(directionOrm);
      return Result.success<Direction>(direction, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }
  async saveDireccion(direccion: Direction): Promise<Result<Direction>> {
    try {
      const directionOrm = await this.directionMapper.fromDomainToPersistence(direccion);
      this.save(directionOrm);
      return Result.success<Direction>(direccion, 201);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }

  async findAll(idCostumer: string): Promise<Result<Direction[]>> {
    try {
      const directionsOrm = await this.createQueryBuilder('direction')
        .select(['direction.id_Direction', 'direction.direction_Direction', 'direction.latitude_Direction', 'direction.longuitud_Direction'])
        .where('direction.costumer_Direction = :idCostumer', { idCostumer })
        .getMany();

      const directions = await Promise.all(
        directionsOrm.map(async direction => {
          return this.directionMapper.fromPersistenceToDomain(direction);
        }),
      );

      return Result.success<Direction[]>(directions, 200);
    } catch (e) {
      return Result.fail(null, 500, e.message);
    }
  }
}
