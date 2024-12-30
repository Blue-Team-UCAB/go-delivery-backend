import { Result } from '../../../common/domain/result-handler/result';
import { Direction } from '../entities/direction';

export interface IDirrecionRepository {
  findById(id: string): Promise<Result<Direction>>;
  saveDireccion(direccion: Direction): Promise<Result<Direction>>;
}
