import { Entity } from 'src/common/domain/entity';
import { DirectionId } from '../value-objects/direction-id';
import { DirectionLatitude } from '../value-objects/direction-latitude';
import { DirectionLongitud } from '../value-objects/direction-longitude';
import { DirectionDescription } from '../value-objects/direction-direction';
import { DirectionName } from '../value-objects/direction-name';

export class Direction extends Entity<DirectionId> {
  constructor(
    id: DirectionId,
    private direction: DirectionDescription,
    private latitude: DirectionLatitude,
    private longitud: DirectionLongitud,
    private name: DirectionName,
  ) {
    super(id);
  }

  get Latitude(): DirectionLatitude {
    return this.latitude;
  }

  get Longitud(): DirectionLongitud {
    return this.longitud;
  }

  get Description(): DirectionDescription {
    return this.direction;
  }

  get Name(): DirectionName {
    return this.name;
  }

  modify(direction: DirectionDescription, latitude: DirectionLatitude, longitud: DirectionLongitud, name: DirectionName): void {
    this.direction = direction;
    this.latitude = latitude;
    this.longitud = longitud;
    this.name = name;
  }
}
