import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { UpdateCustomerEntryDto } from './dtos/entry/update-custumer.entry.dto';
import { UpdateCustomerResponseDto } from './dtos/response/update-customer.response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IUserRepository } from 'src/auth/application/repository/user-repository.interface';
import { CustomerName } from '../domain/value-objects/customer-name';
import { CustomerPhone } from '../domain/value-objects/customer-phone';
import { ICrypto } from 'src/common/application/crypto/crypto';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { CustomerImage } from '../domain/value-objects/customer-image';
import { IStorageS3Service } from 'src/common/application/s3-storage-service/s3.storage.service.interface';

export class UpdateCustomerApplicationService implements IApplicationService<UpdateCustomerEntryDto, UpdateCustomerResponseDto> {
  constructor(
    private readonly customerRepositiry: ICustomerRepository,
    private readonly userRepositiry: IUserRepository,
    private readonly passwordHasher: ICrypto,
    private readonly idGenerator: IdGenerator<string>,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: UpdateCustomerEntryDto): Promise<Result<UpdateCustomerResponseDto>> {
    const user = await this.userRepositiry.getById(data.idUser);

    if (user.getAssigned() === false) {
      return Result.fail<UpdateCustomerResponseDto>(null, 404, 'User not found');
    }

    const customer = await this.customerRepositiry.findById(data.idCustomer);

    if (!customer.isSuccess()) {
      return Result.fail<UpdateCustomerResponseDto>(null, 404, 'Customer not found');
    }

    if (data.email) {
      user.getValue().emailUser = data.email;
    }

    if (data.name) {
      customer.Value.updateName(CustomerName.create(data.name));
    }

    if (data.password) {
      const password = await this.passwordHasher.encrypt(data.password);
      user.getValue().passwordUser = password;
    }

    if (data.phone) {
      customer.Value.updatePhone(CustomerPhone.create(data.phone));
    }

    if (data.imageBuffer) {
      const imageKey = `customer/${await this.idGenerator.generateId()}.png`;
      const image = new CustomerImage(await this.s3Service.uploadFile(imageKey, data.imageBuffer, data.contentType));
      customer.Value.updateImage(image);
    }

    const respUser = await this.userRepositiry.updateUser(user.getValue());

    if (!respUser.isSuccess()) {
      return Result.fail<UpdateCustomerResponseDto>(null, 500, 'Error updating user');
    }

    const respCustomer = await this.customerRepositiry.saveCustomer(customer.Value);

    if (!respCustomer.isSuccess()) {
      return Result.fail<UpdateCustomerResponseDto>(null, 500, 'Error updating customer');
    }

    return Result.success<UpdateCustomerResponseDto>(
      {
        id: user.getValue().idUser,
      },
      200,
    );
  }
}
