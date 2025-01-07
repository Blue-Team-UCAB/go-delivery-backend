import { Body, Controller, Get, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
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
import { ModifiedDirecionApplicationService } from 'src/customer/application/modified-direction.application.service';
import { ModifyDirectionEntryDto } from '../dto/entry/modify-direction.entry.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCustomerImageEntryDto } from '../dto/entry/update-customer-image.entry.dto';
import { UpdateCustomerImageApplicationService } from 'src/customer/application/update-custumer-image.application.service';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';

@Controller('customer')
export class CustomerController {
  private readonly customerRepository: CustomerRepository;
  private readonly uuidCreator: UuidGenerator;
  private readonly directionRepository: DirectionRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
  ) {
    this.customerRepository = new CustomerRepository(this.dataSource);
    this.uuidCreator = new UuidGenerator();
    this.directionRepository = new DirectionRepository(this.dataSource);
  }

  @Post('update-image')
  @UseInterceptors(FileInterceptor('image'))
  @UseAuth()
  async UpdateImage(@Body() updateCustomerImage: UpdateCustomerImageEntryDto, @GetUser() user: AuthInterface, @UploadedFile() image: Express.Multer.File) {
    const service = new UpdateCustomerImageApplicationService(this.customerRepository, this.uuidCreator, this.s3Service);
    updateCustomerImage.contentType = image.mimetype;
    updateCustomerImage.imageBuffer = image.buffer;
    return await service.execute({ customerId: user.idCostumer, ...updateCustomerImage });
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

  @Post('modify-direction')
  @UseAuth()
  async ModifyDirection(@Body() modifyDirection: ModifyDirectionEntryDto, @GetUser() user: AuthInterface) {
    const service = new ModifiedDirecionApplicationService(this.customerRepository);
    return await service.execute({ costumerId: user.idCostumer, ...modifyDirection });
  }
}
