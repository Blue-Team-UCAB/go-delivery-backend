import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UseAuth } from '../jwt/decorator/useAuth.decorator';
import { IsClientOrAdmin } from '../jwt/decorator/isClientOrAdmin.decorator';
import { GetUser } from '../jwt/decorator/get-user.decorator';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';
import { PushTokenDto } from '../dto/push-token.dto';
import { AuthPushTokenUserApplicationService } from 'src/auth/application/services/auth-push-token.user.application.service';
import { DataSource } from 'typeorm';

import { UserRepository } from '../repository/user.repository';
import { ApiBody } from '@nestjs/swagger';

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
  @ApiBody({ type: PushTokenDto })
  async pushToken(@GetUser() user: AuthInterface, @Body() data: PushTokenDto) {
    const service = new AuthPushTokenUserApplicationService(this.userRepository);
    return await service.execute({ ...data, idUser: user.idUser });
  }
}
