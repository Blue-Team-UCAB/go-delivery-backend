import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { PaymentCheckPagoMovil } from 'src/common/infrastructure/payment-check/payment-check-pagoMovil';
import { CustomerRepository } from 'src/customer/infrastructure/repository/costumer-repository';
import { CreatePaymentPagoMovilApplicationService } from 'src/payment/application/commands/create-payment-pago-movil.application.service';
import { DataSource } from 'typeorm';
import { PaymentRepository } from '../repository/payment-repository';
import { GetUser } from 'src/auth/infrastructure/jwt/decorator/get-user.decorator';
import { UseAuth } from 'src/auth/infrastructure/jwt/decorator/useAuth.decorator';
import { WalletRepository } from 'src/customer/infrastructure/repository/wallet-repository';
import { PagoMovilEntryDto } from '../dto/payment-pago-movil.entry.dto';
import { ZelleEntryDto } from '../dto/payment-zelle.entry.dto';
import { PaymentCheckZelle } from 'src/common/infrastructure/payment-check/payment-check-zelle';
import { IsClientOrAdmin } from 'src/auth/infrastructure/jwt/decorator/isClientOrAdmin.decorator';
import { StripeService } from 'src/common/infrastructure/providers/services/stripe.service';
import { PaymentRegisterStripeEntryDto } from '../dto/payment-register-stripe.entry.dto';
import { GetWalletAmountApplicationService } from 'src/payment/application/response/get-wallet-amount.application.service';
import { AuthInterface } from 'src/common/infrastructure/auth-interface/aunt.interface';

@ApiTags('Payment')
@Controller('payment/method')
export class PaymentController {
  private readonly costumerRepository: CustomerRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly walletRepository: WalletRepository;
  private readonly stripe: StripeService;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly uuidGenator: UuidGenerator,
    private readonly paymentCheckPagoMovil: PaymentCheckPagoMovil,
  ) {
    this.costumerRepository = new CustomerRepository(this.dataSource);
    this.paymentRepository = new PaymentRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
    this.stripe = new StripeService();
  }

  @Post('recharge/pago-movil')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBody({ type: PagoMovilEntryDto })
  async createPaymentPagoMovil(@Body() data: PagoMovilEntryDto, @GetUser() user: AuthInterface) {
    const service = new CreatePaymentPagoMovilApplicationService(this.paymentCheckPagoMovil, this.costumerRepository, this.walletRepository, this.paymentRepository, this.uuidGenator);
    return await service.execute({ ...data, idCustomer: user.idCostumer, typo: 'Pago Movil' });
  }

  @Post('recharge/zelle')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBody({ type: ZelleEntryDto })
  async createPaymentZelle(@Body() data: ZelleEntryDto, @GetUser() user: AuthInterface) {
    const service = new CreatePaymentPagoMovilApplicationService(new PaymentCheckZelle(), this.costumerRepository, this.walletRepository, this.paymentRepository, this.uuidGenator);
    return await service.execute({ ...data, date: new Date(), idCustomer: user.idCostumer, typo: 'Zelle' });
  }

  @Post('user/add/card')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBody({ type: PaymentRegisterStripeEntryDto })
  async createPaymentStripe(@Body() data: PaymentRegisterStripeEntryDto, @GetUser() user: AuthInterface) {
    return await this.stripe.saveCard(user.idStripe, data.idCard);
  }

  @Get('user/card/many')
  @IsClientOrAdmin()
  @UseAuth()
  async getCards(@GetUser() user: AuthInterface) {
    return await this.stripe.getCards(user.idStripe);
  }

  @Get('user/wallet-amount')
  @IsClientOrAdmin()
  @UseAuth()
  async getWalletAmount(@GetUser() user: AuthInterface) {
    const service = new GetWalletAmountApplicationService(this.walletRepository, this.costumerRepository);
    return await service.execute({ idCustomer: user.idCostumer });
  }

  @Get('many')
  @IsClientOrAdmin()
  async getPayments() {}
}
