import { Result } from '../../../common/domain/result-handler/result';
import { Costumer } from '../costumer';

export interface ICostumerRepository {
  findById(id: string): Promise<Result<Costumer>>;
  saveCostumer(costumer: Costumer): Promise<Result<Costumer>>;
}
