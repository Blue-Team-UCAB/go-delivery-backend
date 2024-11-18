import { Controller, Post, Body, Inject, Get, Param, ValidationPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { UserRepository } from '../repository/user.repository';
import { UuidGenerator } from '../../../common/infrastructure/id-generator/uuid-generator';
import { Sha256Service } from '../../../common/infrastructure/providers/services/sha256Service.service';
import { SignUpUserDto } from '../dto/sign-up.user.dto';
import { AuthCreateUserApplicationService } from '../../application/services/auth-create-user-application.service';
import { JwtGenerator } from '../jwt/jwt-generator';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from '../dto/sign-in.user.dto';
import { AuthLoginUserApplicationService } from '../../application/services/auth-login-user-application.service';
import { ForgotPasswordUserApplicationService } from '../../application/services/auth-forgotpassword-user-application.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { DateService } from '../../../common/infrastructure/providers/services/date.service';
import { CodeVerificationService } from 'src/common/infrastructure/providers/services/codeGenerator.service';
import { MailSenderService } from 'src/common/infrastructure/providers/services/emailProvider.service';
import { ChangePasswordCodeDto } from '../dto/change-password-code.dto';
import { ChangePasswordCodeUserApplicationService } from 'src/auth/application/services/auth-changepassword-code-user.application.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly userRepository: UserRepository;
  private readonly jwtGenerator: JwtGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    @Inject('JwtGenerator')
    private readonly jwtService: JwtService,
    private readonly sha256Service: Sha256Service,
    private readonly dateService: DateService,
    private readonly uuidGenator: UuidGenerator,
    private readonly codeGenerator: CodeVerificationService,
    private readonly mailService: MailSenderService,
  ) {
    this.userRepository = new UserRepository(this.dataSource);
    this.jwtGenerator = new JwtGenerator(this.jwtService);
  }

  @Post('register')
  async create(@Body() createUser: SignUpUserDto) {
    const service = new AuthCreateUserApplicationService(this.userRepository, this.uuidGenator, this.sha256Service, this.jwtGenerator);
    return await service.execute(createUser);
  }

  @Post('login')
  async login(@Body() user: SignInUserDto) {
    const service = new AuthLoginUserApplicationService(this.userRepository, this.sha256Service, this.jwtGenerator);
    return await service.execute(user);
  }

  @Post('forgot/password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const service = new ForgotPasswordUserApplicationService(this.userRepository, this.dateService, this.sha256Service, this.codeGenerator, this.mailService);
    return await service.execute(data);
  }

  @Post('change/password')
  async changePassword(@Body() data: ChangePasswordCodeDto) {
    const service = new ChangePasswordCodeUserApplicationService(this.userRepository, this.dateService, this.sha256Service);
    return await service.execute(data);
  }
}
