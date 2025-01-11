import { Body, Controller, Delete, Get, Inject, Param, Post, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { IsAdmin } from 'src/auth/infrastructure/jwt/decorator/isAdmin.decorator';
import { PaymentMethodRepository } from '../repository/payment-method.repository';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/common/infrastructure/providers/services/s3.service';
import { CreatePaymentMethodEntryDto } from '../dto/create-payment-method.entry.dto';
import { EnableDisablePaymentMethodEntryDto } from '../dto/enable-disable-payment-method.entry.dto';
import { PaymentMethodGuard } from '../guards/payment-method.guard';

@ApiTags('Payment')
@Controller('payment/method')
export class PaymentController {
  private readonly costumerRepository: CustomerRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly walletRepository: WalletRepository;
  private readonly orderRepository: OrderRepository;
  private readonly stripe: StripeService;
  private readonly paymentMethodRepository: PaymentMethodRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly uuidGenator: UuidGenerator,
    private readonly paymentCheckPagoMovil: PaymentCheckPagoMovil,
    private readonly s3Service: S3Service,
  ) {
    this.costumerRepository = new CustomerRepository(this.dataSource);
    this.paymentRepository = new PaymentRepository(this.dataSource);
    this.orderRepository = new OrderRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
    this.stripe = new StripeService();
    this.paymentMethodRepository = new PaymentMethodRepository(this.dataSource);
  }

  @Post('recharge/pago-movil')
  @UseGuards(PaymentMethodGuard)
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
  @UseGuards(PaymentMethodGuard)
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

  @Get('many')
  @IsAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async getPayments() {
    const resp = await this.paymentMethodRepository.getOnlyActivePaymentMethods();
    if (!resp.isSuccess) {
      throw new UnauthorizedException('Error al obtener los metodos de pago');
    }

    const response = await Promise.all(
      resp.Value.map(async element => ({
        idPayment: element.id_PaymentMethod,
        name: element.name_PaymentMethod,
        state: 'active',
        image: await this.s3Service.getFile(element.image_PaymentMethod),
      })),
    );

    return response;
  }

  @Post('disable')
  @IsAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async disablePaymentMethod(@Body() data: EnableDisablePaymentMethodEntryDto) {
    const resp = await this.paymentMethodRepository.updatePaymentMethod(data.id_payment_method, false);
    if (!resp.isSuccess) {
      throw new UnauthorizedException('Error al deshabilitar el metodo de pago');
    }
    return {
      id_payment_method: resp.Value.id_PaymentMethod,
    };
  }

  @Post('enable')
  @IsAdmin()
  @UseAuth()
  @ApiBearerAuth()
  async enablePaymentMethod(@Body() data: EnableDisablePaymentMethodEntryDto) {
    const resp = await this.paymentMethodRepository.updatePaymentMethod(data.id_payment_method, true);
    if (!resp.isSuccess) {
      throw new UnauthorizedException('Error al habilitar el metodo de pago');
    }
    return {
      id_payment_method: resp.Value.id_PaymentMethod,
    };
  }

  @Post('create')
  @IsAdmin()
  @UseAuth()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: CreatePaymentMethodEntryDto })
  async createPaymentMethod(@Body() data: CreatePaymentMethodEntryDto, @UploadedFile() image: Express.Multer.File) {
    const uuid = await this.uuidGenator.generateId();
    const uuidImage = await this.uuidGenator.generateId();
    const imagekey = `payment-method/${uuidImage}.png`;
    const respImage = await this.s3Service.uploadFile(imagekey, image.buffer, image.mimetype);

    if (!respImage) {
      throw new UnauthorizedException('Error al crear el metodo de pago');
    }
    const resp = await this.paymentMethodRepository.createPaymentMethod({ id_PaymentMethod: uuid, name_PaymentMethod: data.name, state_PaymentMethod: true, image_PaymentMethod: imagekey });
    if (!resp.isSuccess) {
      throw new UnauthorizedException('Error al crear el metodo de pago');
    }
    return {
      id_payment_method: resp.Value.id_PaymentMethod,
    };
  }
}
