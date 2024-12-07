import { Entity } from 'src/common/domain/entity';
import { DirectionId } from '../value-objects/direction-id';
import { DirectionLatitude } from '../value-objects/direction-latitude';
import { DirectionLonguitud } from '../value-objects/direction-longuitude';
import { DirectionDescription } from '../value-objects/direction-direction';

export class Direction extends Entity<DirectionId> {
  constructor(
    id: DirectionId,
    private direction: DirectionDescription,
    private latitude: DirectionLatitude,
    private longuitud: DirectionLonguitud,
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
}
