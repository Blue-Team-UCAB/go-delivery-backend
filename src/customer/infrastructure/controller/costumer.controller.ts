import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CustomerRepository } from '../repository/costumer-repository';
import { DataSource } from 'typeorm';
import { UseAuth } from 'src/auth/infrastructure/jwt/decorator/useAuth.decorator';
import { AddDirecionEntryDto } from '../dto/entry/add-direction.entry.dto';
import { AddDirectionApplicationService } from 'src/customer/application/add-direction.application.service';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';
import { GetUser } from 'src/auth/infrastructure/jwt/decorator/get-user.decorator';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { GetAllDirectionApplicationService } from 'src/customer/application/get-all-directions.application.service';
import { DirectionRepository } from '../repository/direction-repository';
import { IsClientOrAdmin } from 'src/auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { GetDirectionEntryDto } from '../dto/entry/get-direction.entry.dto';
import { GetDirectionApplicationService } from 'src/customer/application/get-direction.application.service';

@Controller('customer')
export class CustomerController {
  private readonly customerRepository: CustomerRepository;
  private readonly uuidCreator: UuidGenerator;
  private readonly directionRepository: DirectionRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
  ) {
    this.customerRepository = new CustomerRepository(this.dataSource);
    this.uuidCreator = new UuidGenerator();
    this.directionRepository = new DirectionRepository(this.dataSource);
  }

  @Post('add-direction')
  @UseAuth()
  async AddDirecion(@Body() addDirection: AddDirecionEntryDto, @GetUser() user: AuthInterface) {
    const service = new AddDirectionApplicationService(this.customerRepository, this.uuidCreator);
    return await service.execute({ costumerId: user.idCostumer, ...addDirection });
  }

  @Get('directions')
  @UseAuth()
  async GetAllDirections(@GetUser() user: AuthInterface) {
    const service = new GetAllDirectionApplicationService(this.directionRepository);
    return await service.execute({ costumerId: user.idCostumer });
  }

  @Get('direction')
  @IsClientOrAdmin()
  async GetDirection(@Body() getDirection: GetDirectionEntryDto) {
    const service = new GetDirectionApplicationService(this.directionRepository);
    return await service.execute(getDirection);
  }
}
