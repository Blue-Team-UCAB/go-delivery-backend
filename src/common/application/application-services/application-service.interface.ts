import { Result } from '../../Domain/result-handler/Result';

export interface IApplicationService<D, R> {
  execute(data: D): Promise<Result<R>>;
}
