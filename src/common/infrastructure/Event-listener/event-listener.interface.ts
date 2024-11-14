import { RmqContext } from '@nestjs/microservices';

export interface IListener<T> {
  handle(data: T, context: RmqContext): void;
}
