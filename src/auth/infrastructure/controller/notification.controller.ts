import { Body, Controller, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { UseAuth } from '../jwt/decorator/useAuth.decorator';
import { IsClientOrAdmin } from '../jwt/decorator/isClientOrAdmin.decorator';
import { GetUser } from '../jwt/decorator/get-user.decorator';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';
import { PushTokenDto } from '../dto/push-token.dto';
import { AuthPushTokenUserApplicationService } from 'src/auth/application/services/auth-push-token.user.application.service';
import { DataSource } from 'typeorm';
import { UserRepository } from '../repository/user.repository';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ErrorHandlerAspect } from 'src/common/application/aspects/error-handler-aspect';

@Controller('Notifications')
export class NotificationsController {
  private readonly userRepository: UserRepository;
  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
  ) {
    this.userRepository = new UserRepository(this.dataSource);
  }

  @Post('savetoken')
  @UseAuth()
  @IsClientOrAdmin()
  @ApiBearerAuth()
  @ApiBody({ type: PushTokenDto })
  async pushToken(@GetUser() user: AuthInterface, @Body() data: PushTokenDto) {
    const service = new ErrorHandlerAspect(new AuthPushTokenUserApplicationService(this.userRepository), error => {
      throw new InternalServerErrorException(error.message);
    });
    return (await service.execute({ ...data, idUser: user.idUser })).Value;
  }
}
