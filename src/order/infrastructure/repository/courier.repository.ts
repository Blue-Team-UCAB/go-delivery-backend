import { Injectable } from '@nestjs/common';
import { ICourierRepository } from '../../application/repositories/courier-repository.interface';
import { DataSource, Repository } from 'typeorm';
import { OrderCourierORMEntity } from '../models/orm-order-courier.entity';
import { Result } from 'src/common/domain/result-handler/result';
import { CourierDto } from 'src/order/application/dto/response/get-order-id-service.response.dto';

@Injectable()
export class CourierRepository extends Repository<OrderCourierORMEntity> implements ICourierRepository {
  constructor(dataSource: DataSource) {
    super(OrderCourierORMEntity, dataSource.createEntityManager());
  }

  async findAllCourier(): Promise<Result<CourierDto[]>> {
    try {
      const courier = await this.createQueryBuilder('courier').select(['courier.id', 'courier.name', 'courier.phone', 'courier.image']).getMany();
      let couriers: CourierDto[] = [];
      courier.map(courier => {
        couriers.push({
          id: courier.id,
          name: courier.name,
          phone: courier.phone,
          image: courier.image,
        });
      });
      return Result.success<CourierDto[]>(couriers, 200);
    } catch (error) {
      return Result.fail<CourierDto[]>(null, 500, error.message);
    }
  }
}
