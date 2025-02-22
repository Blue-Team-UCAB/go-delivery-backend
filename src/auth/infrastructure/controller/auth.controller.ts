import { Controller, Post, Body, Inject, Get, Patch, Put, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
import { CodeVerificationService } from 'src/common/infrastructure/providers/services/codeGenerator.service';
import { MailSenderService } from 'src/common/infrastructure/providers/services/emailProvider.service';
import { ChangePasswordCodeDto } from '../dto/change-password-code.dto';
import { ChangePasswordCodeUserApplicationService } from 'src/auth/application/services/auth-changepassword-code-user.application.service';
import { UseAuth } from '../jwt/decorator/useAuth.decorator';
import { GetUser } from '../jwt/decorator/get-user.decorator';
import { CustomerRepository } from 'src/customer/infrastructure/repository/costumer-repository';
import { AuthCurrentApplicationService } from 'src/auth/application/services/auth-current-user.application.service';
import { WalletRepository } from 'src/customer/infrastructure/repository/wallet-repository';
import { StripeService } from 'src/common/infrastructure/providers/services/stripe.service';
import { IsClientOrAdmin } from '../jwt/decorator/isClientOrAdmin.decorator';
import { PushTokenDto } from '../dto/push-token.dto';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';
import { AuthPushTokenUserApplicationService } from 'src/auth/application/services/auth-push-token.user.application.service';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { ErrorHandlerAspect } from 'src/common/application/aspects/error-handler-aspect';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly userRepository: UserRepository;
  private readonly jwtGenerator: JwtGenerator;
  private readonly costumerRepository: CustomerRepository;
  private readonly walletRepository: WalletRepository;
  private readonly stripe: StripeService;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    @Inject('JwtGenerator')
    private readonly jwtService: JwtService,
    private readonly sha256Service: Sha256Service,
    private readonly uuidGenator: UuidGenerator,
    private readonly codeGenerator: CodeVerificationService,
    private readonly mailService: MailSenderService,
    private readonly s3Service: S3Service,
  ) {
    this.userRepository = new UserRepository(this.dataSource);
    this.jwtGenerator = new JwtGenerator(this.jwtService);
    this.costumerRepository = new CustomerRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
    this.stripe = new StripeService();
  }

  @ApiBody({
    type: SignUpUserDto,
  })
  @Post('register')
  async create(@Body() createUser: SignUpUserDto) {
    const service = new ErrorHandlerAspect(
      new AuthCreateUserApplicationService(this.userRepository, this.uuidGenator, this.sha256Service, this.jwtGenerator, this.costumerRepository, this.walletRepository, this.stripe),
      (error: Error) => {
        throw new UnauthorizedException('User already exists');
      },
    );
    return (await service.execute(createUser)).Value;
  }

  @ApiBody({
    type: SignInUserDto,
  })
  @Post('login')
  async login(@Body() user: SignInUserDto) {
    const service = new ErrorHandlerAspect(new AuthLoginUserApplicationService(this.userRepository, this.sha256Service, this.jwtGenerator, this.costumerRepository), (error: Error) => {
      throw new NotFoundException('User not found');
    });
    return (await service.execute(user)).Value;
  }

  @ApiBody({
    type: ForgotPasswordDto,
  })
  @Post('forget/password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const service = new ErrorHandlerAspect(
      new ForgotPasswordUserApplicationService(this.userRepository, this.sha256Service, this.codeGenerator, this.mailService, this.costumerRepository),
      (error: Error) => {
        throw new NotFoundException('User not found');
      },
    );
    return (await service.execute(data)).Value;
  }

  @ApiBody({
    type: ChangePasswordCodeDto,
  })
  @Put('change/password')
  async changePassword(@Body() data: ChangePasswordCodeDto) {
    const service = new ErrorHandlerAspect(new ChangePasswordCodeUserApplicationService(this.userRepository, this.sha256Service), (error: Error) => {
      throw new UnauthorizedException('User not found');
    });
    return (await service.execute(data)).Value;
  }

  @Get('current')
  @UseAuth()
  @IsClientOrAdmin()
  @ApiBearerAuth()
  async current(@GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new AuthCurrentApplicationService(this.costumerRepository, this.s3Service), (error: Error) => {
      throw new NotFoundException('User not found');
    });
    return (await service.execute({ idCostumer: user.idCostumer, id: user.idUser, role: user.roleUser, email: user.emailUser })).Value;
  }
}
