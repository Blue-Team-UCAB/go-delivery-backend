import { Observable } from 'rxjs';

export interface IPublisher<T> {
  publish(pattern: string, data: T): Promise<Observable<T>>;
}
