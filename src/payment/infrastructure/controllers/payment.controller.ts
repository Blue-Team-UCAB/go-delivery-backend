import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UuidGenerator } from 'src/common/infrastructure/id-generator/uuid-generator';
import { PaymentCheckPagoMovil } from 'src/common/infrastructure/payment-check/payment-check-pagoMovil';
import { CostumerRepository } from 'src/costumer/infrastructure/repository/costumer-repository';
import { CreatePaymentPagoMovilApplicationService } from 'src/payment/application/commands/create-payment-pago-movil.application.service';
import { DataSource } from 'typeorm';
import { PaymentRepository } from '../repository/payment-repository';
import { GetUser } from 'src/auth/infrastructure/jwt/decorator/get-user.decorator';
import { UseAuth } from 'src/auth/infrastructure/jwt/decorator/useAuth.decorator';
import { WalletRepository } from 'src/costumer/infrastructure/repository/wallet-repository';
import { PagoMovilEntryDto } from '../dto/payment-pago-movil.entry.dto';

@ApiTags('Payment')
@Controller('pay')
export class PaymentController {
  private readonly costumerRepository: CostumerRepository;
  private readonly paymentRepository: PaymentRepository;
  private readonly walletRepository: WalletRepository;

  constructor(
    @Inject('BaseDeDatos')
    private readonly dataSource: DataSource,
    private readonly uuidGenator: UuidGenerator,
  ) {
    this.costumerRepository = new CostumerRepository(this.dataSource);
    this.paymentRepository = new PaymentRepository(this.dataSource);
    this.walletRepository = new WalletRepository(this.dataSource);
  }

  @Post('pago-movil')
  @UseAuth()
  async createPaymentPagoMovil(@Body() data: PagoMovilEntryDto, @GetUser() user: any) {
    const service = new CreatePaymentPagoMovilApplicationService(new PaymentCheckPagoMovil(), this.costumerRepository, this.walletRepository, this.paymentRepository, this.uuidGenator);
    return await service.execute({ ...data, idCustomer: user.idCostumer });
  }
}
