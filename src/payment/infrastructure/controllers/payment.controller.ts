import { Body, Controller, Delete, Get, Inject, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
import { GetAllPaymentsApplicationService } from 'src/payment/application/get-all-transaccion.application.service';
import { OrderRepository } from 'src/order/infrastructure/repository/order.repository';
import { ErrorHandlerAspect } from 'src/common/application/aspects/error-handler-aspect';

@ApiTags('Payment')
@Controller('payment/method')
export class PaymentController {
  private readonly costumerRepository: CustomerRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly walletRepository: WalletRepository;
  private readonly orderRepository: OrderRepository;
  private readonly stripe: StripeService;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly uuidGenator: UuidGenerator,
    private readonly paymentCheckPagoMovil: PaymentCheckPagoMovil,
  ) {
    this.costumerRepository = new CustomerRepository(this.dataSource);
    this.paymentRepository = new PaymentRepository(this.dataSource);
    this.orderRepository = new OrderRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
    this.stripe = new StripeService();
  }

  @Post('recharge/pago-movil')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  @ApiBody({ type: PagoMovilEntryDto })
  async createPaymentPagoMovil(@Body() data: PagoMovilEntryDto, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(
      new CreatePaymentPagoMovilApplicationService(this.paymentCheckPagoMovil, this.costumerRepository, this.walletRepository, this.paymentRepository, this.uuidGenator),
      error => {
        throw new UnauthorizedException('Error al procesar el pago');
      },
    );
    return (await service.execute({ ...data, idCustomer: user.idCostumer, typo: 'Pago Movil' })).Value;
  }

  @Post('recharge/zelle')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  @ApiBody({ type: ZelleEntryDto })
  async createPaymentZelle(@Body() data: ZelleEntryDto, @GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(
      new CreatePaymentPagoMovilApplicationService(new PaymentCheckZelle(), this.costumerRepository, this.walletRepository, this.paymentRepository, this.uuidGenator),
      error => {
        throw new UnauthorizedException('Error al procesar el pago');
      },
    );
    return (await service.execute({ ...data, date: new Date(), idCustomer: user.idCostumer, typo: 'Zelle' })).Value;
  }

  @Post('user/add/card')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  @ApiBody({ type: PaymentRegisterStripeEntryDto })
  async createPaymentStripe(@Body() data: PaymentRegisterStripeEntryDto, @GetUser() user: AuthInterface) {
    return await this.stripe.saveCard(user.idStripe, data.idCard);
  }

  @Get('user/card/many')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async getCards(@GetUser() user: AuthInterface) {
    return await this.stripe.getCards(user.idStripe);
  }

  @Get('user/wallet-amount')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async getWalletAmount(@GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new GetWalletAmountApplicationService(this.walletRepository, this.costumerRepository), error => {
      throw new UnauthorizedException('Error al obtener el monto de la billetera');
    });
    return (await service.execute({ idCustomer: user.idCostumer })).Value;
  }

  @Delete('user/card/delete/:id')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async deleteCard(@GetUser() user: AuthInterface, @Param('id') idCard: string) {
    return await this.stripe.deleteCard(user.idStripe, idCard);
  }

  @Get('many')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async getPayments() {}

  @Get('user/many/transaccion')
  @IsClientOrAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async getPaymentsByUser(@GetUser() user: AuthInterface) {
    const service = new ErrorHandlerAspect(new GetAllPaymentsApplicationService(this.paymentRepository, this.orderRepository, this.stripe), error => {
      throw new UnauthorizedException('Error al obtener las transacciones');
    });
    return (await service.execute({ idCustomer: user.idCostumer, idStripe: user.idStripe })).Value;
  }
}
