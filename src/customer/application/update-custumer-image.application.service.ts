import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { UpdateCustomerImageEntryDto } from './dtos/entry/update-customer-image.entry.dto';
import { UpdateCustomerImageResponseDto } from './dtos/response/update-customer-image.response.dto';
import { IStorageS3Service } from 'src/common/application/s3-storage-service/s3.storage.service.interface';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { CustomerImage } from '../domain/value-objects/customer-image';

export class UpdateCustomerImageApplicationService implements IApplicationService<UpdateCustomerImageEntryDto, UpdateCustomerImageResponseDto> {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: UpdateCustomerImageEntryDto): Promise<Result<UpdateCustomerImageResponseDto>> {
    const customer = await this.customerRepository.findById(data.customerId);

    if (!customer.isSuccess()) {
      return Result.fail<UpdateCustomerImageResponseDto>(customer.Error, customer.StatusCode, customer.Message);
    }

    const imageKey = `customer/${await this.idGenerator.generateId()}.png`;

    const image = new CustomerImage(await this.s3Service.uploadFile(imageKey, data.imageBuffer, data.contentType));

    customer.Value.updateImage(image);

    const updated = await this.customerRepository.saveCustomer(customer.Value);

    if (!updated.isSuccess()) {
      return Result.fail<UpdateCustomerImageResponseDto>(updated.Error, updated.StatusCode, updated.Message);
    }

    const imageUrl = await this.s3Service.getFile(customer.Value.Image.Url);

    return Result.success<UpdateCustomerImageResponseDto>(
      {
        image: imageUrl,
      },
      200,
    );
  }
}
