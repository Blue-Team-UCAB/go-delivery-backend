import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CustomerRepository } from '../repository/costumer-repository';
import { DataSource, In } from 'typeorm';
import { UseAuth } from 'src/auth/infrastructure/jwt/decorator/useAuth.decorator';
import { AddDirecionEntryDto } from '../dto/entry/add-direction.entry.dto';
import { AddDirectionApplicationService } from 'src/customer/application/add-direction.application.service';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';
import { GetUser } from 'src/auth/infrastructure/jwt/decorator/get-user.decorator';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { GetAllDirectionApplicationService } from 'src/customer/application/get-all-directions.application.service';
import { DirectionRepository } from '../repository/direction-repository';
import { IsClientOrAdmin } from 'src/auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { GetDirectionApplicationService } from 'src/customer/application/get-direction.application.service';
import { ModifiedDirecionApplicationService } from 'src/customer/application/modified-direction.application.service';
import { ModifyDirectionEntryDto } from '../dto/entry/modify-direction.entry.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCustomerImageEntryDto } from '../dto/entry/update-customer-image.entry.dto';
import { UpdateCustomerImageApplicationService } from 'src/customer/application/update-custumer-image.application.service';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { DeleteDirectionApplicationService } from 'src/customer/application/delete-direction.application.service';
import { ErrorHandlerAspect } from 'src/common/application/aspects/error-handler-aspect';
import { UpdateCustomerEntryDto } from '../dto/entry/update-customer.entry.dto';
import { UpdateCustomerApplicationService } from 'src/customer/application/update-customer.application.service';
import { IUserRepository } from 'src/auth/application/repository/user-repository.interface';
import { UserRepository } from 'src/auth/infrastructure/repository/user.repository';
import { Sha256Service } from 'src/common/infrastructure/providers/services/sha256Service.service';

@Controller('user')
export class UserController {
  private readonly customerRepository: CustomerRepository;
  private readonly uuidCreator: UuidGenerator;
  private readonly directionRepository: DirectionRepository;
  private readonly userRepositiry: IUserRepository;
  private readonly sha256Service: Sha256Service;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly s3Service: S3Service,
  ) {
    this.customerRepository = new CustomerRepository(this.dataSource);
    this.uuidCreator = new UuidGenerator();
    this.directionRepository = new DirectionRepository(this.dataSource);
    this.userRepositiry = new UserRepository(this.dataSource);
    this.sha256Service = new Sha256Service();
  }

  @Patch('update/image')
  @UseInterceptors(FileInterceptor('image'))
  @UseAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'File',
        },
      },
    },
  })
  @ApiBearerAuth()
  @IsClientOrAdmin()
  async UpdateImage(@Body() updateCustomerImage: UpdateCustomerImageEntryDto, @GetUser() user: AuthInterface, @UploadedFile() image: Express.Multer.File) {
    const service = new ErrorHandlerAspect(new UpdateCustomerImageApplicationService(this.customerRepository, this.uuidCreator, this.s3Service), error => {
      throw new InternalServerErrorException('Error al actualizar la imagen del usuario');
    });
    updateCustomerImage.contentType = image.mimetype;
    updateCustomerImage.imageBuffer = image.buffer;
    return (await service.execute({ customerId: user.idCostumer, ...updateCustomerImage })).Value;
  }

  @ApiBody({
    type: AddDirecionEntryDto,
  })
  @Post('add/address')
  @UseAuth()
  @ApiBearerAuth()
  @IsClientOrAdmin()
  async AddDirecion(@Body() addDirection: AddDirecionEntryDto, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new AddDirectionApplicationService(this.customerRepository, this.uuidCreator), error => {
      throw new InternalServerErrorException('Error al agregar la direccion del usuario');
    });
    return (await service.execute({ costumerId: user.idCostumer, ...addDirection, latitude: addDirection.lat, longitude: addDirection.long })).Value;
  }

  @Get('address/many')
  @UseAuth()
  @ApiBearerAuth()
  @IsClientOrAdmin()
  async GetAllDirections(@GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new GetAllDirectionApplicationService(this.directionRepository), error => {
      throw new InternalServerErrorException('Error al obtener las direcciones del usuario');
    });
    return (await service.execute({ costumerId: user.idCostumer })).Value;
  }

  @Get('address/:id')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async GetDirection(@Param('id') idDirection: string) {
    const service = new ErrorHandlerAspect(new GetDirectionApplicationService(this.directionRepository), error => {
      throw new InternalServerErrorException('Error al obtener la direccion del usuario');
    });
    return (await service.execute({ idDirection: idDirection })).Value;
  }

  @Patch('update/address')
  @ApiBody({
    type: ModifyDirectionEntryDto,
  })
  @ApiBearerAuth()
  @IsClientOrAdmin()
  @UseAuth()
  async ModifyDirection(@Body() modifyDirection: ModifyDirectionEntryDto, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new ModifiedDirecionApplicationService(this.customerRepository), error => {
      throw new InternalServerErrorException('Error al modificar la direccion del usuario');
    });
    return (await service.execute({ costumerId: user.idCostumer, ...modifyDirection, latitude: modifyDirection.lat, longitude: modifyDirection.long })).Value;
  }

  @Delete('delete/address/:id')
  @UseAuth()
  @ApiBearerAuth()
  @IsClientOrAdmin()
  async DeleteDirection(@Param('id') idDirection: string, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new DeleteDirectionApplicationService(this.customerRepository, this.directionRepository), error => {
      throw new InternalServerErrorException('Error al eliminar la direccion del usuario');
    });
    return (await service.execute({ idCustomer: user.idCostumer, idDirection: idDirection })).Value;
  }

  @Patch('update/profile')
  @UseAuth()
  @ApiBearerAuth()
  @IsClientOrAdmin()
  @UseInterceptors(FileInterceptor('image'))
  async UpdateProfile(@Body() updateProfile: UpdateCustomerEntryDto, @GetUser() user: AuthInterface, @UploadedFile() image: Express.Multer.File) {
    if (image) {
      updateProfile.imageBuffer = image.buffer;
      updateProfile.contentType = image.mimetype;
    }
    const service = new ErrorHandlerAspect(new UpdateCustomerApplicationService(this.customerRepository, this.userRepositiry, this.sha256Service, this.uuidCreator, this.s3Service), error => {
      throw new InternalServerErrorException('Error al actualizar el perfil del usuario');
    });
    return (await service.execute({ idUser: user.idUser, idCustomer: user.idCostumer, ...updateProfile })).Value;
  }
}
