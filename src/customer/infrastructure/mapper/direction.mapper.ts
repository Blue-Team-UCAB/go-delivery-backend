import { IMapper } from 'src/common/application/mapper/mapper.interface';
import { Direction } from 'src/customer/domain/entities/direction';
import { DirectionORMEntity } from '../model/orm-direction.entity';
import { DirectionId } from 'src/customer/domain/value-objects/direction-id';
import { DirectionDescription } from 'src/customer/domain/value-objects/direction-direction';
import { DirectionLatitude } from 'src/customer/domain/value-objects/direction-latitude';
import { DirectionLonguitud } from 'src/customer/domain/value-objects/direction-longuitude';

export class DirectionMapper implements IMapper<Direction, DirectionORMEntity> {
  async fromDomainToPersistence(domain: Direction): Promise<DirectionORMEntity> {
    const directionORM = new DirectionORMEntity();
    directionORM.id_Direction = domain.Id.Id;
    directionORM.direction_Direction = domain.Description.Description;
    directionORM.latitude_Direction = domain.Latitude.Latitude;
    directionORM.longuitud_Direction = domain.Longuitud.Longuitud;
    return directionORM;
  }
  async fromPersistenceToDomain(persistence: DirectionORMEntity): Promise<Direction> {
    return new Direction(
      DirectionId.create(persistence.id_Direction),
      DirectionDescription.create(persistence.direction_Direction),
      DirectionLatitude.create(persistence.latitude_Direction),
      DirectionLonguitud.create(persistence.longuitud_Direction),
    );
  }
}
