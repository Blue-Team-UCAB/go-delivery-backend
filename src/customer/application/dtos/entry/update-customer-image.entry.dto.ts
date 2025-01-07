export interface UpdateCustomerImageEntryDto {
  customerId: string;
  imageBuffer?: Buffer;
  contentType?: string;
}
