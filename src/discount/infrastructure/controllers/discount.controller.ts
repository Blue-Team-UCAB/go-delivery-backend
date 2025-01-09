import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountRepository } from '../repository/discount.repository';
import { DataSource } from 'typeorm';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { CreateDiscountApplicationSergvice } from '../../application/commands/create-discount-application.service';

@ApiTags('Discounts')
@Controller('discount')
export class DiscountController {
  private readonly discountRepository: DiscountRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly uuidCreator: UuidGenerator,
    private readonly dateService: DateService,
  ) {
    this.discountRepository = new DiscountRepository(this.dataSource);
  }

  @Post()
  async createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
    const service = new CreateDiscountApplicationSergvice(this.discountRepository, this.uuidCreator, this.dateService);
    return await service.execute(createDiscountDto);
  }
}
