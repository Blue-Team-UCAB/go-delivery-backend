import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from '../application-services/application-service.interface';

export class ErrorHandlerAspect<T, E> implements IApplicationService<T, E> {
  constructor(
    private readonly applicationService: IApplicationService<T, E>,
    private readonly errorHandler: (error: Error) => void,
  ) {}

  async execute(data: T): Promise<Result<E>> {
    try {
      const result = await this.applicationService.execute(data);
      if (!result.isSuccess()) {
        result.Error;
      }
      return result;
    } catch (error) {
      this.errorHandler(error.message);
    }
  }
}
