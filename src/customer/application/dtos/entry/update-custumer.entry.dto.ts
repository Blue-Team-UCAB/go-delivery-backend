export interface UpdateCustomerEntryDto {
  idCustomer: string;
  idUser: string;
  email?: string;
  name?: string;
  password?: string;
  phone?: string;
  imageBuffer?: Buffer;
  contentType?: string;
}
