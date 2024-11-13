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

@ApiTags('Auth')
@Controller('Auth')
export class AuthController {
  private readonly userRepository: UserRepository;
  private readonly uuidGenator: UuidGenerator;
  private readonly jwtGenerator: JwtGenerator;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    @Inject('JwtGenerator')
    private readonly jwtService: JwtService,
    private readonly sha256Service: Sha256Service,
  ) {
    this.userRepository = new UserRepository(this.dataSource);
    this.uuidGenator = new UuidGenerator();
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
}
