import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { CreatePaymentEntryDto } from '../dto/entry/create-payment.entry.dto';
import { CreatePaymentResponseDto } from '../dto/response/create-payment.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { IPaymentCheck } from 'src/common/application/payment-check/payment-check.interface';
import { ICostumerRepository } from '../../../costumer/domain/repositories/costumer-repository.interface';
import { IPaymentRepository } from 'src/payment/domain/repositories/payment-repository.interface';
import { Payment } from 'src/payment/domain/payment';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { PaymentId } from 'src/payment/domain/value-objects/payment-Id';
import { PaymentName } from 'src/payment/domain/value-objects/payment-name';
import { PaymentDate } from 'src/payment/domain/value-objects/payment-date';
import { PaymentAmount } from 'src/payment/domain/value-objects/payment-amount';
import { PaymentReference } from 'src/payment/domain/value-objects/payment-reference';
import { CostumerId } from 'src/costumer/domain/value-objects/costumer-id';
import { WalletAmount } from 'src/costumer/domain/value-objects/wallet-amount';
import { IWalletRepository } from 'src/costumer/domain/repositories/wallet-repository.interface';

export class CreatePaymentPagoMovilApplicationService implements IApplicationService<CreatePaymentEntryDto, CreatePaymentResponseDto> {
  constructor(
    private readonly paymentCheck: IPaymentCheck,
    private readonly customerRepository: ICostumerRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly uuidGenerator: IdGenerator<string>,
  ) {}

  async execute(data: CreatePaymentEntryDto): Promise<Result<CreatePaymentResponseDto>> {
    const costumer = await this.customerRepository.findById(data.idCustomer);

    if (!costumer.isSuccess) {
      return Result.fail<CreatePaymentResponseDto>(null, 400, 'Customer not found');
    }

    const checkMoney = await this.paymentCheck.checkPayment(data);

    if (checkMoney < 0) {
      return Result.fail<CreatePaymentResponseDto>(null, 400, 'Payment failed');
    }

    const paymentId = await this.uuidGenerator.generateId();

    const payment = new Payment(
      PaymentId.create(paymentId),
      PaymentName.create(data.typo),
      PaymentDate.create(data.date),
      PaymentAmount.create(checkMoney),
      PaymentReference.create(data.reference),
      CostumerId.create(data.idCustomer),
    );

    costumer.Value.sumWallet(WalletAmount.create(checkMoney));

    const updatedWallet = await this.walletRepository.saveWallet(costumer.Value.Wallet);

    if (!updatedWallet.isSuccess) {
      return Result.fail<CreatePaymentResponseDto>(null, 500, 'Internal server error');
    }

    const createdPayment = await this.paymentRepository.savePayment(payment);

    if (!createdPayment.isSuccess) {
      return Result.fail<CreatePaymentResponseDto>(null, 500, 'Internal server error');
    }

    const response: CreatePaymentResponseDto = {};
    return Result.success<CreatePaymentResponseDto>(response, 200);
  }
}
