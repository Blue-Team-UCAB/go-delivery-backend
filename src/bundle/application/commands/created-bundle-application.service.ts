import { Injectable } from '@nestjs/common';
import { IApplicationService } from '../../../common/application/application-services/application-service.interface';
import { CreateBundleServiceEntryDto } from '../dto/entry/create-bundle-service-entry.dto';
import { CreateBundleServiceResponseDto } from '../dto/response/create-bundle-service-response.dto';
import { Result } from '../../../common/domain/result-handler/result';
import { IdGenerator } from '../../../common/application/id-generator/id-generator.interface';
import { Bundle } from '../../domain/bundle';
import { BundleId } from '../../domain/value-objects/bundle.id';
import { BundleName } from '../../domain/value-objects/bundle-name';
import { BundleDescription } from '../../domain/value-objects/bundle-description';
import { BundleCurrency } from '../../domain/value-objects/bundle-currency';
import { BundlePrice } from '../../domain/value-objects/bundle-price';
import { BundleStock } from '../../domain/value-objects/bundle-stock';
import { BundleWeight } from '../../domain/value-objects/bundle-weight';
import { BundleImage } from '../../domain/value-objects/bundle-image';
import { BundleCaducityDate } from '../../domain/value-objects/bundle-caducity-date';
import { IBundleRepository } from '../../domain/repositories/bundle-repository.interface';
import { IProductRepository } from '../../../product/domain/repositories/product-repository.interface';
import { BundleProduct } from '../../domain/entities/bundle-product';
import { BundleProductQuantity } from '../../domain/value-objects/bundle-product-quantity';
import { IStorageS3Service } from '../../../common/application/s3-storage-service/s3.storage.service.interface';
import { PricableAndWeightable } from 'src/bundle/domain/interfaces/bundle-composite';
import { BundleEntity } from '../../domain/entities/bundle';
import { BundleQuantity } from '.././../../bundle/domain/value-objects/bundle-quantity';
import { BundleProductResponseDto } from '../dto/response/bundle-product-response.dto';

@Injectable()
export class createBundleApplicationService implements IApplicationService<CreateBundleServiceEntryDto, CreateBundleServiceResponseDto> {
  constructor(
    private readonly bundleRepository: IBundleRepository,
    private readonly productRepository: IProductRepository,
    private readonly idGenerator: IdGenerator<string>,
    private readonly s3Service: IStorageS3Service,
  ) {}

  async execute(data: CreateBundleServiceEntryDto): Promise<Result<CreateBundleServiceResponseDto>> {
    const imageKey = `bundles/${await this.idGenerator.generateId()}.jpg`;

    const bundleProducts: PricableAndWeightable[] = [];

    for (const product of data.products) {
      let productEntity: PricableAndWeightable;
      if (product.type === 'product') {
        const productResult = await this.productRepository.findProductById(product.id);
        if (!productResult.isSuccess || !productResult.Value) {
          return Result.fail<CreateBundleServiceResponseDto>(productResult.Error, productResult.StatusCode, productResult.Message);
        }
        const productDetail = productResult.Value;
        productEntity = new BundleProduct(productDetail.Id, productDetail.Name, productDetail.Price, productDetail.Weight, productDetail.ImageUrl, BundleProductQuantity.create(product.quantity));
      } else if (product.type === 'bundle') {
        const bundleResult = await this.bundleRepository.findBundleById(product.id);
        if (!bundleResult.isSuccess || !bundleResult.Value) {
          return Result.fail<CreateBundleServiceResponseDto>(bundleResult.Error, bundleResult.StatusCode, bundleResult.Message);
        }
        const bundleDetail = bundleResult.Value;
        productEntity = new BundleEntity(bundleDetail.Id, bundleDetail.Name, bundleDetail.Price, bundleDetail.Weight, bundleDetail.ImageUrl, BundleQuantity.create(product.quantity));
      }

      bundleProducts.push(productEntity);
    }

    const dataBundle = {
      name: BundleName.create(data.name),
      description: BundleDescription.create(data.description),
      currency: BundleCurrency.create(data.currency),
      stock: BundleStock.create(data.stock),
      imageUrl: BundleImage.create(imageKey),
      caducityDate: BundleCaducityDate.create(data.caducityDate),
      products: bundleProducts,
    };

    const bundle = new Bundle(
      BundleId.create(await this.idGenerator.generateId()),
      dataBundle.name,
      dataBundle.description,
      dataBundle.currency,
      BundlePrice.create(0),
      dataBundle.stock,
      BundleWeight.create(0),
      dataBundle.imageUrl,
      dataBundle.caducityDate,
      dataBundle.products,
    );

    bundle.calculatePrice();
    bundle.calculateWeight();

    const result = await this.bundleRepository.saveBundleAggregate(bundle);

    const imageUrl = await this.s3Service.uploadFile(imageKey, data.imageBuffer, data.contentType);

    if (!result.isSuccess()) {
      return Result.fail<CreateBundleServiceResponseDto>(result.Error, result.StatusCode, result.Message);
    }

    const imagenUlr = await this.s3Service.getFile(bundle.ImageUrl.Url);

    const products: BundleProductResponseDto[] = await Promise.all(
      bundle.Products.map(async product => {
        let imageUrlBundle: string = '';
        if (product instanceof BundleProduct) {
          imageUrlBundle = await this.s3Service.getFile(product.Image.Url);
          return {
            id: product.Id.Id,
            name: product.Name.Name,
            price: product.Price.Price,
            weight: product.Weight.Weight,
            imageUrl: imageUrlBundle,
            quantity: product.Quantity.Quantity,
            type: 'product' as const,
          };
        } else if (product instanceof BundleEntity) {
          imageUrlBundle = await this.s3Service.getFile(product.Image.Url);
          return {
            id: product.Id.Id,
            name: product.Name.Name,
            price: product.Price.Price,
            weight: product.Weight.Weight,
            imageUrl: imageUrlBundle,
            quantity: product.Quantity.Quantity,
            type: 'bundle' as const,
          };
        }
        return null;
      }).filter(product => product !== null),
    );

    const response: CreateBundleServiceResponseDto = {
      id: bundle.Id.Id,
      name: bundle.Name.Name,
      description: bundle.Description.Description,
      currency: bundle.Currency.Currency,
      price: bundle.Price.Price,
      stock: bundle.Stock.Stock,
      weight: bundle.Weight.Weight,
      imageUrl: imagenUlr,
      caducityDate: bundle.CaducityDate.CaducityDate,
      products: products,
    };

    return Result.success<CreateBundleServiceResponseDto>(response, 200);
  }
}
