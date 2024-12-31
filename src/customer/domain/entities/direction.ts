import { Entity } from 'src/common/domain/entity';
import { DirectionId } from '../value-objects/direction-id';
import { DirectionLatitude } from '../value-objects/direction-latitude';
import { DirectionLonguitud } from '../value-objects/direction-longuitude';
import { DirectionDescription } from '../value-objects/direction-direction';
import { DirectionName } from '../value-objects/direction-name';

export class Direction extends Entity<DirectionId> {
  constructor(
    id: DirectionId,
    private direction: DirectionDescription,
    private latitude: DirectionLatitude,
    private longuitud: DirectionLonguitud,
    private name: DirectionName,
  ) {
    super(id);
  }

  get Latitude(): DirectionLatitude {
    return this.latitude;
  }

  get Longuitud(): DirectionLonguitud {
    return this.longuitud;
  }

  get Description(): DirectionDescription {
    return this.direction;
  }

  get Name(): DirectionName {
    return this.name;
  }

  modify(direction: DirectionDescription, latitude: DirectionLatitude, longuitud: DirectionLonguitud, name: DirectionName): void {
    this.direction = direction;
    this.latitude = latitude;
    this.longuitud = longuitud;
    this.name = name;
  }
}
