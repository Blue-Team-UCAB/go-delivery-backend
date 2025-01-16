import { Observable } from 'rxjs';
import { IPublisher } from 'src/common/application/events/eventPublisher.interface';

export class PublisherMock<T> implements IPublisher<T> {
  publish(pattern: string, data: T): Promise<Observable<T>> {
    return Promise.resolve(
      new Observable(subscriber => {
        subscriber.next(data);
        subscriber.complete();
      }),
    );
  }
}
